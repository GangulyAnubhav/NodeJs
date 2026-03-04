import { app } from "@azure/functions";

import "./functions/planTrip.js";

app.setup({
    enableHttpStream: true,
});
