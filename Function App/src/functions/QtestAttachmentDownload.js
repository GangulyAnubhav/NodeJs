const axios = require("axios");
const dotenv = require("dotenv");
const { app } = require("@azure/functions");
 
dotenv.config();
 
app.http(
    "DownloadqTestAttachment",
    {
        methods: ["GET"],
        authLevel: "anonymous",
        handler: async (request, context) => {
            try {
                //object type
                const objectType = request.query.get("objectType");
                //object id
                const objectId = request.query.get("objectId");
                //attachment id
                const attachmentId = request.query.get("attachmentId");
                //attachment name
                const attachmentName = request.query.get("attachmentName");
                //context.log(objectType, objectId, attachmentId, attachmentName);
 
                //Check if any missing parameter is there
                if (!objectType || !objectId || !attachmentId || !attachmentName) {
                    return { status: 400, body: "Missing parameters" };
                }
 
                //qTest header build
                const qTestHeader = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.qTestToken}`
                };
 
                //get qtest artifact linked attachment req body
                const getqTestDefectAttachmentReq = {
                    url: `${process.env.qTestHostURL}/api/v3/projects/${process.env.qTestProjectID}/${objectType}/${objectId}/attachments/${attachmentId}`,
                    headers: qTestHeader,
                    data: null,
                    method: 'GET',
                    responseType: 'arraybuffer'
                };
       
                //get qtest artifact linked attachment req capture
                const getqTestDefectAttachmentRes = await axios( getqTestDefectAttachmentReq);
 
                //Return the file to the browser and brwoser will ask the location for download or download automatically
                return {
                    status: 200,
                    headers: {
                        "Content-Type": "application/octet-stream",
                        "Content-Disposition": `attachment; filename="${attachmentName}"`
                    },
                    body: getqTestDefectAttachmentRes.data
                };
 
            } catch (err) {
                //context.log(err);
                return {
                    status: 500,
                    body: "Failed to download attachment"
                };
            }
        }
    }
);