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
"""Create Command for Application Service."""

from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

from googlecloudsdk.api_lib.apphub import utils as api_lib_utils
from googlecloudsdk.api_lib.apphub.applications import services as apis
from googlecloudsdk.calliope import base
from googlecloudsdk.calliope import exceptions
from googlecloudsdk.command_lib.apphub import flags


_DETAILED_HELP = {
    'DESCRIPTION': '{description}',
    'EXAMPLES': """ \
        To create a application service with the id `my-application-service` run:

          $ {command} my-application-service
        """,
}


@base.ReleaseTracks(base.ReleaseTrack.ALPHA)
class Create(base.CreateCommand):
  """Create an Apphub application service."""

  detailed_help = _DETAILED_HELP

  @staticmethod
  def Args(parser):
    flags.AddCreateApplicationServiceFlags(parser)

  def Run(self, args):
    """Run the create command."""
    client = apis.ServicesClient()
    service_ref = args.CONCEPTS.service.Parse()
    dis_service_ref = args.CONCEPTS.discovered_service.Parse()
    parent_ref = service_ref.Parent()
    if not service_ref.Name():
      raise exceptions.InvalidArgumentException(
          'service', 'service id must be non-empty.'
      )
    attributes = api_lib_utils.PopulateAttributes(args)

    return client.Create(
        service_id=service_ref.Name(),
        parent=parent_ref.RelativeName(),
        async_flag=args.async_,
        discovered_service=dis_service_ref.RelativeName(),
        display_name=args.display_name,
        description=args.description,
        attributes=attributes,
    )
