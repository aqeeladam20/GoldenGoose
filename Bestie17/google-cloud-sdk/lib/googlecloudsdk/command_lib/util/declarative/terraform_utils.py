# -*- coding: utf-8 -*- #
# Copyright 2021 Google LLC. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Module containing the command utils for resource-config/terraform surface."""

from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

import os
import re

from googlecloudsdk.calliope.exceptions import core_exceptions
from googlecloudsdk.core import log
from googlecloudsdk.core.console import console_io
from googlecloudsdk.core.util import files
from googlecloudsdk.core.util import platforms
from googlecloudsdk.core.util import times
from mako import runtime
from mako import template


IMPORT_REGEX = re.compile(r'^#')
_IMPORT_CMD_PREFIX = 'terraform import'
IMPORT_SCRIPT_DEFAULT_NAME = 'terraform_import_{ts}.{suffix}'
IMPORT_DATE_FORMAT = '%Y%m%d-%H-%M-%S'

MODULE_TEMPLATE = """
module "{module_name}" {{
  source = "{module_source}"
}}
"""

_BASH_COMMENTS = """
#!/bin/sh
# Terraform Import Script generated by gcloud cli
"""

INVALID_EXPORT_PATH_MSG = ('Invalid export Path {}. Path should point to an '
                           'export Terraform(.tf) file or directotry of '
                           'Terraform files.\nPlease see `gcloud alpha '
                           'resource-config bulk-export` for more details.')

TF_MODULES_FILENAME = 'gcloud-export-modules.tf'


class TerraformGenerationError(core_exceptions.Error):
  """Base Exception for errors that occur during import script generation."""


def ParseExportFiles(export_path):
  """Read files from export path and parse out import command statements."""
  # Test for valid path -> Raise FNF on error
  if os.path.isfile(export_path) and export_path.endswith('.tf'):
    input_files = [export_path]
  elif os.path.isdir(export_path):
    input_files = files.GetDirectoryTreeListing(
        export_path,
        include_dirs=False,
        file_predicate=lambda x: x.endswith('.tf'))
  else:
    raise ValueError(INVALID_EXPORT_PATH_MSG)
  import_data = []
  error_files = []
  for in_file in input_files:
    in_file_base_name = os.path.basename(in_file)
    if 'default' in in_file_base_name or in_file_base_name[0].isdigit():
      os.remove(in_file)
    else:
      import_reader = files.FilteredFileReader(in_file, IMPORT_REGEX)
      try:
        # Tuple of (file_path, import command statement)
        command = list(import_reader).pop()
        import_line = (files.ExpandHomeAndVars(os.path.dirname(in_file)),
                       command.partition('#')[2].strip())
        import_data.append(import_line)
      except IndexError:
        error_files.append(in_file)
      except files.Error as e:
        raise TerraformGenerationError(  # pylint: disable=raise-missing-from
            'Could not parse Terrorm data from {path}:: {err}'.format(
                path=export_path, err=e))

  if not import_data:
    raise TerraformGenerationError(
        'No Terraform importable data found in {path}.'.format(
            path=export_path))
  if error_files:
    log.warning(
        'Error generating imports for the following resource files: {}'.format(
            '\n'.join(error_files)))
  return import_data


def GenerateDefaultScriptFileName():
  """Generate a default filename for import script."""
  suffix = 'cmd' if platforms.OperatingSystem.IsWindows() else 'sh'
  return IMPORT_SCRIPT_DEFAULT_NAME.format(
      ts=times.FormatDateTime(times.Now(), IMPORT_DATE_FORMAT), suffix=suffix)


def ConstructModuleParameters(import_path, dest_dir):
  module_source = os.path.join('.',
                               os.path.relpath(import_path, start=dest_dir))
  module_name = '-'.join(
      os.path.normpath(import_path.replace(dest_dir, '')).split(
          os.sep)).lstrip('-').rstrip()
  if module_name[0].isdigit():
    module_name = 'gcp-{}'.format(module_name)
  return module_source, module_name


def ProcessOutputParameters(output_file=None, output_dir=None):
  """Helper function for generating output file and directory."""
  output_file = output_file.strip() if output_file else None
  output_dir = (os.path.abspath(output_dir.strip()) if output_dir else None)
  dest_file = None
  dest_dir = None
  if output_file:
    if os.path.isfile(output_file):
      overwrite_prompt = ('{} already exists.'.format(output_file))
      console_io.PromptContinue(
          overwrite_prompt,
          prompt_string='Do you want to overwrite?',
          default=True,
          cancel_string='Aborted script generation.',
          cancel_on_no=True)
    dest_file = os.path.basename(output_file)
    dest_dir = os.path.dirname(output_file) or files.GetCWD()

    if os.path.isdir(dest_dir) and not files.HasWriteAccessInDir(dest_dir):
      raise TerraformGenerationError(
          'Error writing output file: {} is not writable'.format(dest_dir))

  # Output directory.
  if output_dir:
    if (os.path.isdir(output_dir) and
        not files.HasWriteAccessInDir(output_dir)):
      raise ValueError('Cannot write output to directory {}. '
                       'Please check permissions.'.format(output_dir))
    dest_file = None
    dest_dir = output_dir

  return dest_file, dest_dir


def GenerateImportScript(import_data, dest_file=None, dest_dir=None):
  """Generate Terraform import shell script from template.

  Args:
    import_data: string, Import data for each resource.
    dest_file: string, Filename path to write the generated script to. If
      dest_file is None, then a default filename will be generated.
    dest_dir: string, Directory path to write the generated script to. If
      dest_dir is None, then script will be written to CWD.

  Returns:
    tuple(string, int, [string])), the path to the generated script, number of
      import statements generated and list of files that could not be processed.

  Raises:
    TerraformGenerationError: If and error occurs writing to disk/stdout.
  """

  output_file_name = os.path.join(dest_dir, dest_file)
  context = {'data': []}
  for import_path, import_statement in import_data:
    _, module_name = ConstructModuleParameters(import_path, dest_dir)
    import_cmd_data = import_statement.partition(_IMPORT_CMD_PREFIX)[1:]
    context['data'].append('{cmd} module.{module_name}.{cmd_sfx}'.format(
        cmd=import_cmd_data[0],
        module_name=module_name,
        cmd_sfx=import_cmd_data[1].strip()))

  context['data'] = os.linesep.join(context['data'])

  output_template = None
  template_key = 'WINDOWS' if platforms.OperatingSystem.IsWindows() else 'BASH'
  if template_key == 'WINDOWS':
    output_template = _BuildTemplate('windows_shell_template.tpl')
  elif template_key == 'BASH':
    context['bash_comments'] = _BASH_COMMENTS
    output_template = _BuildTemplate('bash_shell_template.tpl')

  try:
    with files.FileWriter(
        output_file_name, create_path=True) as f:
      ctx = runtime.Context(f, **context)
      output_template.render_context(ctx)
    os.chmod(output_file_name, 0o755)
  except files.Error as e:
    raise TerraformGenerationError(  # pylint: disable=raise-missing-from
        'Error writing import script::{}'.format(e))
  return output_file_name, len(import_data)


def GenerateModuleFile(import_data, project, dest_file=None, dest_dir=None):
  """Generate terraform modules file from template."""
  output_file_name = os.path.join(dest_dir, dest_file)
  output_template = _BuildTemplate('terraform_module_template.tpl')
  module_contents = set()
  for import_path, _ in import_data:
    module_source, module_name = ConstructModuleParameters(
        import_path, dest_dir)
    module_contents.add((module_name, module_source))
  module_declarations = []
  for module in module_contents:
    module_declarations.append(
        MODULE_TEMPLATE.format(module_name=module[0], module_source=module[1]))

  context = {'project': project}
  context['modules'] = os.linesep.join(module_declarations)

  try:
    with files.FileWriter(output_file_name, create_path=True) as f:
      ctx = runtime.Context(f, **context)
      output_template.render_context(ctx)
    os.chmod(output_file_name, 0o755)
  except files.Error as e:
    raise TerraformGenerationError(  # pylint: disable=raise-missing-from
        'Error writing import script::{}'.format(e))
  return output_file_name, len(module_contents)


def _BuildTemplate(template_file_name):
  dir_name = os.path.dirname(__file__)
  template_path = os.path.join(dir_name, 'terraform_templates',
                               template_file_name)
  file_template = template.Template(filename=template_path)
  return file_template
