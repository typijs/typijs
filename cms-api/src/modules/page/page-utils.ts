
import Page from './page.model';
import PageVersion from './page-version.model';

const batchSize = 100;

export function updateLinkUrl(parentPage, parentLinkUrl) {

    var itemCursor = Page.collection.find({ parentPath: `/${parentPage._id}/` });
    var itemBulk = Page.collection.initializeUnorderedBulkOp();

    var pageVersionBulk = PageVersion.collection.initializeUnorderedBulkOp();


    var totalResults = 0;
    var totalUpdated = 0;
    var totalWritten = 0;
    var endStream = false;

    itemCursor.batchSize(batchSize).forEach(item => {
        totalResults++;

        asyncUpdateChildrenParentPath(parentPage, item, itemUpdated => {
            itemBulk.find({ _id: item._id }).update({ $set: itemUpdated });
            totalUpdated++;

            if (totalUpdated % batchSize == 0) { // run executes as batch fills up
                itemBulk.execute(function (err, res) {
                    totalWritten += res.nModified;

                    if (endStream && totalWritten == totalUpdated) {
                        //callback({ updated: totalUpdated });
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
                            //callback({ updated: totalUpdated });
                        }
                    });
                }
            }
        });

    }, function (res) {

        // note: if not using an async update, you need to put the itemBulk.execute() if statement here as well

        endStream = true;

        if (!totalResults) {
            //callback({ updated: 0 });
        }

    });

}


// check for duplicates, run calculations, compare items, etc
function asyncUpdateChildrenParentPath(parentPage, page, callback) {
    let parentId = parentPage._id;
    let index = page.ancestors.findIndex(p => p == parentId)
    //update parent path, ancestors and link url
    let paths = page.parentPath.split(',').filter(x=>x);

    setTimeout(() => {
        callback(page);
    }, 100);
}

function asyncUpdateChildrenLinkUrl(parentPage, page, callback) {
    let parentId = parentPage._id;
    let index = page.ancestors.findIndex(p => p == parentId)
    //update parent path, ancestors and link url
    let paths = 
    setTimeout(() => {
        callback(page);
    }, 100);
}