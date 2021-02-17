/**
 * Version status
 */
export enum VersionStatus {
    /**
     * The item or language has not been created.
     */
    NotCreated,
    /**
     * The version was rejected rather than published, and returned to the writer.
     */
    Rejected,
    /**
     * The version is currently in progress.
     */
    CheckedOut,
    /**
     * A writer has checked in the version and waits for the version to be approved and published.
     */
    CheckedIn,
    /**
     * The currently published version.
     */
    Published,
    /**
     * This version has been published previously but is now replaced by a more recent version.
     */
    PreviouslyPublished,
    /**
     * This version will be automatically published when the current time has passed the Start Publish date.
     */
    DelayedPublish,
    /**
     * This is a pre-release status that is UNSTABLE and might not satisfy the compatibility requirements as denoted by its associated normal version.
     * The version is awaiting approval
     */
    AwaitingApproval
}
