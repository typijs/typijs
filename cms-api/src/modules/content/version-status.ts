/**
 * Version status
 */
export class VersionStatus {
    /**
     * The item or language has not been created.
     */
    static NotCreated: number = 0;
    /**
     * The version was rejected rather than published: number = 1; and returned to the writer.
     */
    static Rejected: number = 1;
    /**
     * The version is currently in progress.
     * Draft
     */
    static CheckedOut: number = 2;
    /**
     * A writer has checked in the version and waits for the version to be approved and published.
     * Ready to publish
     */
    static CheckedIn: number = 3;
    /**
     * The currently published version.
     */
    static Published: number = 4;
    /**
     * This version has been published previously but is now replaced by a more recent version.
     */
    static PreviouslyPublished: number = 5;
    /**
     * This version will be automatically published when the current time has passed the Start Publish date.
     */
    static DelayedPublish: number = 6;
    /**
     * This is a pre-release status that is UNSTABLE and might not satisfy the compatibility requirements as denoted by its associated normal version.
     * The version is awaiting approval
     */
    static AwaitingApproval: number = 7;

    /**
     * Check if version status is draft (CheckedOut or Rejected)
     * @param status 
     */
    static isDraftVersion(status: number): boolean {
        return status == this.CheckedOut || status == this.Rejected
    }
}
