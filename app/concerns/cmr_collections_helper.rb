module CMRCollectionsHelper
  extend ActiveSupport::Concern

  def get_revisions(concept_id, revision_id)
    # this process was suggested/requested by the CMR team: if the revision is not found,
    # try again because CMR might be a little slow to index if it is a newly published revision
    attempts = 0
    while attempts < 20
      revisions_response = cmr_client.get_collections({ concept_id: concept_id, all_revisions: true, include_granule_counts: true, sort_key: '-revision_date' }, token)
      revisions = if revisions_response.success?
                    revisions_response.body.fetch('items', [])
                  else
                    []
                  end
      revisions.sort! { |a, b| b['meta']['revision-id'] <=> a['meta']['revision-id'] }

      latest = revisions.first
      break if latest && !revision_id
      break if latest && latest['meta']['revision-id'] >= revision_id.to_i
      attempts += 1
      sleep 0.05
      Rails.logger.info("Retrieving a collection record in `get_revisions`. Need to loop, about to try attempt number #{attempts}")
    end

    Rails.logger.error("Error searching for collection #{@concept_id} revision #{@revision_id || 'no revision provided'} in `get_revisions`: #{revisions_response.clean_inspect}") if latest.nil?

    revisions
  end
end