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
"""Command to describe the discovered workloads."""

from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

from googlecloudsdk.api_lib.apphub import discovered_workloads as apis
from googlecloudsdk.calliope import base
from googlecloudsdk.calliope import exceptions
from googlecloudsdk.command_lib.apphub import flags

_DETAILED_HELP = {
    'DESCRIPTION': '{description}',
    'EXAMPLES': """ \
        To describe a discovered workload with the id `my-discovered-workload`, run:

          $ {command} my-discovered-workload
        """,
}


@base.ReleaseTracks(base.ReleaseTrack.ALPHA)
class Describe(base.DescribeCommand):
  """Describe an Apphub discovered workload."""

  detailed_help = _DETAILED_HELP

  @staticmethod
  def Args(parser):
    flags.AddDescribeDiscoveredWorkloadFlags(parser)

  def Run(self, args):
    """Run the describe command."""
    client = apis.DiscoveredWorkloadsClient()
    dis_workload_ref = args.CONCEPTS.discovered_workload.Parse()
    if not dis_workload_ref.Name():
      raise exceptions.InvalidArgumentException(
          'discovered workload', 'discovered workload id must be non-empty.'
      )
    return client.Describe(discovered_workload=dis_workload_ref.RelativeName())
