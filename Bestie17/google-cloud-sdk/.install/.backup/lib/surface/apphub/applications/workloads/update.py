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
"""Command to update an application workload in the Project/Location."""

from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

from googlecloudsdk.api_lib.apphub import utils as api_lib_utils
from googlecloudsdk.api_lib.apphub.applications import workloads as apis
from googlecloudsdk.calliope import base
from googlecloudsdk.calliope import exceptions
from googlecloudsdk.command_lib.apphub import flags

_DETAILED_HELP = {
    'DESCRIPTION': '{description}',
    'EXAMPLES': """ \
        To update a workload with the id `my-application-workload`,
        with a new display name of updatedDisplayName and new description of
        updatedDescription run:

          $ {command} my-application-workload --display-name=updatedDisplayName --description=updatedDescription
        """,
}


@base.ReleaseTracks(base.ReleaseTrack.ALPHA)
class Update(base.UpdateCommand):
  """Update an Apphub application workload."""

  detailed_help = _DETAILED_HELP

  @staticmethod
  def Args(parser):
    flags.AddUpdateApplicationWorkloadFlags(parser)

  def Run(self, args):
    """Run the create command."""
    client = apis.WorkloadsClient()
    workload_ref = args.CONCEPTS.workload.Parse()
    if not workload_ref.Name():
      raise exceptions.InvalidArgumentException(
          'workload', 'workload id must be non-empty.'
      )
    attributes = api_lib_utils.PopulateAttributes(args)
    return client.Update(
        workload_id=workload_ref.RelativeName(),
        async_flag=args.async_,
        attributes=attributes,
        args=args,
    )
