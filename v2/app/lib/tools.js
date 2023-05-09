const mime_types = [
    {
        ext: ["css"],
        mime: "text/css",
    },
    {
        ext: ["js"],
        mime: "text/javascript",
    },
    {
        ext: ["html"],
        mime: "text/html",
    },
    {
        ext: ["png"],
        mime: "image/png",
    },
];

const createSQLLog = (queries, response) => {
    let logs = [];
    for (var l in response) {
        logs.push({
            type: "sql",
            query: queries[l].statement,
            duration: response[l].duration,
            ts: new Date().toISOString(),
        });
    }
    return logs;
};


const getMime = (file) => {
    const ext = file.split(".").pop();
    const mi = mime_types
        .map((m) => {
            return m.ext.indexOf(ext) != -1 ? ext : false;
        })
        .indexOf(ext);
    return mi != -1 ? mime_types[mi].mime : "text/plain";
};

const rand = (min = 1, max = 1000000) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getPerformanceEvent = (key) => {
    var pent = performance.getEntriesByType("resource");
    var idx = pent
        .map((r) => {
            const m = r.name.match(/rand=([^&]+)/);
            return m ? parseInt(m[1]) : 0;
        })
        .indexOf(key);
    if (idx != -1) {
        return pent[idx];
    } else {
        return false;
    }
};

export { getMime, rand, getPerformanceEvent, createSQLLog };
