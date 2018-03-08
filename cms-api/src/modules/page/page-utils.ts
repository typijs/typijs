
import Page from './page.model';
import PageVersion from './page-version.model';

const batchSize = 100;
const timeout = 100;

export function bulkUpdateLinkUrl(parentPage, finishCallback) {
    asyncBulkUpdateChildrenPage(parentPage, asyncUpdateLinkUrl, finishCallback);
}

export function bulkUpdateParentPath(parentPage, finishCallback) {
    asyncBulkUpdateChildrenPage(parentPage, asyncUpdateParentPath, finishCallback);
}

export function bulkUpdateDeletedStatus(parentPage, finishCallback) {
    asyncBulkUpdateChildrenPage(parentPage, asyncUpdateDeletedStatus, finishCallback);
}

//parentPage is page was updated
function asyncBulkUpdateChildrenPage(parentPage,asyncUpdateChildPage, finishCallback) {

    var itemCursor = Page.collection.find({ parentPath: /,${parentPage._id},/ });
    var itemBulk = Page.collection.initializeUnorderedBulkOp();

    var pageVersionBulk = PageVersion.collection.initializeUnorderedBulkOp();


    var totalResults = 0;
    var totalUpdated = 0;
    var totalWritten = 0;
    var endStream = false;

    itemCursor.batchSize(batchSize).forEach(item => {
        totalResults++;

        asyncUpdateChildPage(parentPage, item, itemUpdated => {
            itemBulk.find({ _id: item._id }).update({ $set: itemUpdated });
            totalUpdated++;

            if (totalUpdated % batchSize == 0) { // run executes as batch fills up
                itemBulk.execute(function (err, res) {
                    totalWritten += res.nModified;

                    if (endStream && totalWritten == totalUpdated) {
                        finishCallback({ updated: totalUpdated });
                    }
                });
                itemBulk = Page.collection.initializeUnorderedBulkOp();
            }
            //for case the remaining found items less than batch size
            if (endStream && totalUpdated == totalResults) {
                if (totalUpdated % batchSize != 0) {
                    itemBulk.execute(function (err, res) {
                        totalWritten += res.nModified;

                        if (totalWritten == totalUpdated) {
                            finishCallback({ updated: totalUpdated });
                        }
                    });
                }
            }
        });

    }, function (res) {
        // note: if not using an async update, you need to put the itemBulk.execute() if statement here as well
        endStream = true;
        if (!totalResults) {
            finishCallback({ updated: 0 });
        }
    });
}

function asyncUpdateDeletedStatus(parentPage, page, callback) {
    page.isDeleted = parentPage.isDeleted;
    if (page.isDeleted) {
        page.deleted = Date.now;
        //page.deletedBy = user
    }
    setTimeout(() => {
        callback(page);
    }, timeout);
}

function asyncUpdateLinkUrl(parentPage, page, callback) {
    let parentId = parentPage._id;
    let index = page.ancestors.findIndex(p => p == parentId)

    let paths = page.parentPath.split(',').filter(x => x);

    //update link url
    let segments = page.linkUrl.split('/').filter(x => x);
    let newLinkUrl = parentPage.linkUrl;

    for (var j = segments.length - 1, k = 1; k <= page.ancestors.length - index; j-- , k++) {
        newLinkUrl = newLinkUrl == '/' ? `/${segments[j]}` : `${newLinkUrl}/${segments[j]}`;
    }

    page.isDeleted = parentPage.isDeleted;
    if (page.isDeleted) {
        page.deleted = Date.now;
        //page.deletedBy = user
    }
    page.linkUrl = newLinkUrl;

    setTimeout(() => {
        callback(page);
    }, timeout);
}

// check for duplicates, run calculations, compare items, etc
function asyncUpdateParentPath(parentPage, page, callback) {
    let parentId = parentPage._id;
    let index = page.ancestors.findIndex(p => p == parentId)
    //update parent path, ancestors and link url

    let paths = page.parentPath.split(',').filter(x => x);
    let newPath = parentPage.parentPath ? parentPage.parentPath : ',';
    let newAncestors = parentPage.ancestors.slice();

    for (var i = index; i < page.ancestors.length; i++) {
        newPath = `${newPath}${paths[i]},`;
        newAncestors.push(page.ancestors[i]);
    }

    //update link url
    let segments = page.linkUrl.split('/').filter(x => x);
    let newLinkUrl = parentPage.linkUrl;
    for (var j = segments.length - 1, k = 1; k <= page.ancestors.length - index; j-- , k++) {
        newLinkUrl = newLinkUrl == '/' ? `/${segments[j]}` : `${newLinkUrl}/${segments[j]}`;
    }

    page.isDeleted = parentPage.isDeleted;
    if (page.isDeleted) {
        page.deleted = Date.now;
        //page.deletedBy = user
    }
    page.parentPath = newPath;
    page.ancestors = newAncestors;
    page.linkUrl = newLinkUrl;

    setTimeout(() => {
        callback(page);
    }, timeout);
}
