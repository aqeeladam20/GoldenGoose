# -*- coding: utf-8 -*- #
# Copyright 2023 Google LLC. All Rights Reserved.
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
"""Command to add a Service Project."""

from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

from googlecloudsdk.api_lib.apphub import service_projects as apis
from googlecloudsdk.calliope import base
from googlecloudsdk.calliope import exceptions
from googlecloudsdk.command_lib.apphub import flags


_DETAILED_HELP = {
    'DESCRIPTION': '{description}',
    'EXAMPLES': """ \
        To add a service project with the id `my-service-project` run:

          $ {command} my-service-project
        """,
}


@base.ReleaseTracks(base.ReleaseTrack.ALPHA)
class Create(base.CreateCommand):
  """Add an Apphub service project."""

  detailed_help = _DETAILED_HELP

  @staticmethod
  def Args(parser):
    flags.AddServiceProjectFlags(parser)

  def Run(self, args):
    """Run the add command."""
    client = apis.ServiceProjectsClient()
    service_project_ref = args.CONCEPTS.service_project.Parse()
    parent_ref = service_project_ref.Parent()
    if not service_project_ref.Name():
      raise exceptions.InvalidArgumentException(
          'service project', 'service project id must be non-empty.'
      )
    return client.Add(
        service_project=service_project_ref.Name(),
        async_flag=args.async_,
        parent=parent_ref.RelativeName(),
    )
