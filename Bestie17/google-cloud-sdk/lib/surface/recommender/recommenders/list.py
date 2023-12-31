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
"""recommender API recommenders list command."""

from __future__ import absolute_import
from __future__ import division
from __future__ import unicode_literals

from googlecloudsdk.api_lib.recommender import recommenders
from googlecloudsdk.calliope import base

DETAILED_HELP = {
    'EXAMPLES':
        """
          Lists recommender types.

            $ {command}
        """,
}


@base.ReleaseTracks(
    base.ReleaseTrack.ALPHA, base.ReleaseTrack.BETA, base.ReleaseTrack.GA
)
@base.Hidden
class List(base.ListCommand):
  r"""List recommenders operations.

  This command lists all recommender types.
  """

  detailed_help = DETAILED_HELP

  @staticmethod
  def Args(parser):
    """Args is called by calliope to gather arguments for this command.

    Args:
      parser: An argparse parser that you can use to add arguments that go on
        the command line after this command.
    """
    # flags.AddParentFlagsToParser(parser)
    parser.display_info.AddFormat("""
        table(
          name.basename(): label=RECOMMENDER_ID
        )
    """)

  def Run(self, args):
    """Run 'gcloud recommender recommenders list'.

    Args:
      args: argparse.Namespace, The arguments that this command was invoked
        with.

    Returns:
      The list of recommender types for this project.
    """
    client = recommenders.CreateClient(self.ReleaseTrack())
    return client.List(args.page_size)
