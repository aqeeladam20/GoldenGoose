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
"""Command for listing an organization or source's findings."""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

import re

from apitools.base.py import list_pager
from googlecloudsdk.api_lib.util import apis
from googlecloudsdk.calliope import base
from googlecloudsdk.command_lib.scc import flags as scc_flags
from googlecloudsdk.command_lib.scc import util as scc_util
from googlecloudsdk.command_lib.scc.findings import flags
from googlecloudsdk.command_lib.scc.findings import util
from googlecloudsdk.core import properties
from googlecloudsdk.core.util import times
from googlecloudsdk.generated_clients.apis.securitycenter.v1 import securitycenter_v1_messages as messages


# base.ListCommand defines --filter, --flatten, --limit, --page-size, --sort-by
# and --uri flags
@base.ReleaseTracks(
    base.ReleaseTrack.GA, base.ReleaseTrack.BETA, base.ReleaseTrack.ALPHA
)
class List(base.ListCommand):
  """List an organization or source's findings."""

  detailed_help = {
      "DESCRIPTION": """
          List an organization or source's findings. To list across all
          sources provide a '-' as the source id.""",
      "EXAMPLES": (
          f"""
          List all ACTIVE findings under organization 123456 across all sources:

            $ {{command}} 123456 --filter="state=\\"ACTIVE\\""

          List all ACTIVE findings under project abc across all sources:

            $ {{command}} projects/abc --filter="state=\\"ACTIVE\\""

          List all ACTIVE findings under folder 456 across all sources:

            $ {{command}} folders/456 --filter="state=\\"ACTIVE\\""

          List all ACTIVE findings under organization 123456 and source 5678:

            $ {{command}} 123456 --source=5678 --filter="state=\\"ACTIVE\\""

          Only list category and resource_name of all ACTIVE findings under
          organization 123456 and source 5678:

            $ {{command}} 123456 --source=5678  --filter="state=\\"ACTIVE\\"" --field-mask="finding.category,finding.resource_name"

          List all ACTIVE findings of XSS category/type, under organization 123456 and source 5678:

            $ {{command}} 123456 --source=5678 --filter="state=\\"ACTIVE\\" AND category=\\"XSS\\""

          List all findings attached to a particular resource under organization 123456:

            $ {{command}} 123456
            --filter="resource_name=\\"//container.{properties.VALUES.core.universe_domain.Get()}/projects/pid/zones/zone-id/clusters/cluster-id\\""

          List all ACTIVE findings that took place on 2019-01-01T01:00:00 GMT time, under organization 123456:

            $ {{command}} 123456 --filter="state=\\"ACTIVE\\" AND event_time > 1546304400000"

          List all findings that were ACTIVE as of 2019-01-01T01:00:00 GMT time, under organization 123456:

            $ {{command}} 123456
            --filter="state=\\"ACTIVE\\"" --read-time="2019-01-01T01:00:00Z" """
      ),
      "API REFERENCE": """
          This command uses the securitycenter/v1 API. The full documentation for
          this API can be found at: https://cloud.google.com/security-command-center""",
  }

  @staticmethod
  def Args(parser):
    # Remove URI flag.
    base.URI_FLAG.RemoveFromParser(parser)

    # Add shared flags and parent positional argument.
    scc_flags.AppendParentArg()[0].AddToParser(parser)
    scc_flags.PAGE_TOKEN_FLAG.AddToParser(parser)
    scc_flags.READ_TIME_FLAG.AddToParser(parser)
    flags.COMPARE_DURATION_FLAG.AddToParser(parser)
    flags.SOURCE_FLAG.AddToParser(parser)

    parser.add_argument(
        "--field-mask",
        help="""
        Field mask to specify the finding fields listed in the response. An
        empty field mask will list all fields. For example:
        --field-mask="finding.category,finding.resource_name" will only output
        category and resource_name for the findings in addition to default
        attributes. Notice the difference between hyphens (-) used with flags
        v/s camel case used in field masks. An empty or missing field mask will
        list all fields.""",
    )
    # Cloud SCC doesn't use gcloud's sort-by flag since that sorts at the client
    # level while
    # Cloud SCC's ordering needs to be passed to the server.

    parser.add_argument(
        "--order-by",
        help="""
        Expression that defines what fields and order to use for sorting.
        String value should follow SQL syntax: comma separated list of fields.
        For example: "name,resource_properties.a_property". The default sorting
        order is ascending. To specify descending order for a field, a suffix "
        desc" should be appended to the field name. For example:
        --order-by="name desc,source_properties.a_property" will order by name
        in descending order while source_properties.a_property in ascending
        order.""",
    )

  def Run(self, args):
    request = messages.SecuritycenterOrganizationsSourcesFindingsListRequest()

    # Populate request fields from args.
    request.compareDuration = args.compare_duration
    if request.compareDuration:
      # Process compareDuration argument.
      compare_duration_iso = times.ParseDuration(request.compareDuration)
      request.compareDuration = times.FormatDurationForJson(
          compare_duration_iso
      )

    request.fieldMask = args.field_mask
    request.filter = args.filter
    request.orderBy = args.order_by
    request.pageSize = args.page_size
    request.pageToken = args.page_token
    request.parent = args.parent

    request.readTime = args.read_time
    if request.readTime:
      # Get DateTime from string and convert to the format required by the API.
      read_time_dt = times.ParseDateTime(request.readTime)
      request.readTime = times.FormatDateTime(read_time_dt)

    request = _GenerateParent(args, request)
    client = apis.GetClientInstance("securitycenter", "v1")

    # Automatically handle pagination. All findings are returned regarldess of
    # --page-size argument.
    return list_pager.YieldFromList(
        client.organizations_sources_findings,
        request,
        batch_size_attribute="pageSize",
        batch_size=args.page_size,
        field="listFindingsResults",
    )


def _GenerateParent(args, req):
  """Generates a finding's parent using org and source and hook up filter.

  Args:
    args: (argparse namespace)
    req: request

  Returns:
    req: Modified request
  """
  util.ValidateMutexOnSourceAndParent(args)
  req.parent = util.GetSourceNameForParent(args)
  req.filter = args.filter
  if req.fieldMask is not None:
    req.fieldMask = scc_util.CleanUpUserMaskInput(req.fieldMask)
  args.filter = ""
  resource_pattern = re.compile(
      "(organizations|projects|folders)/.*/sources/[0-9-]+$"
  )
  parent = scc_util.GetParentFromPositionalArguments(args)
  if resource_pattern.match(parent):
    args.source = parent
  return req
