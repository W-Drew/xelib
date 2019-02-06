module.exports = function(lib, xelib, helpers) {
    // UTILITY METHODS
    let releaseHandles = function(item) {
        if (item.constructor === Array) {
            item.forEach(releaseHandles);
        } else {
            xelib.Release(item);
        }
    };

    Object.assign(xelib, {
        Hex: function(n, padding = 8) {
            let str = Number(n).toString(16).toUpperCase();
            while (str.length < padding) str = '0' + str;
            return str;
        },
        WithHandle: function(handle, callback) {
            try {
                return callback(handle);
            } finally {
                if (handle) xelib.Release(handle);
            }
        },
        WithHandles: function(handles, callback) {
            try {
                return callback(handles);
            } finally {
                releaseHandles(handles);
            }
        },
        WithEachHandle: function(handles, callback) {
            try {
                handles.forEach(callback);
            } finally {
                releaseHandles(handles);
            }
        },
        CreateHandleGroup: function() {
            if (xelib.HandleGroup)
                throw new Error('Another handle group is already active!');
            xelib.HandleGroup = [];
        },
        FreeHandleGroup: function() {
            if (!xelib.HandleGroup) return;
            xelib.HandleGroup.forEach(xelib.Release);
            xelib.HandleGroup = undefined;
            xelib.CleanStore();
        },
        OutsideHandleGroup: function(callback) {
            let handleGroup = xelib.HandleGroup;
            try {
                xelib.HandleGroup = undefined;
                callback();
            } finally {
                xelib.HandleGroup = handleGroup;
            }
        },
        WithHandleGroup: function(callback) {
            xelib.CreateHandleGroup();
            try {
                callback();
            } finally {
                xelib.FreeHandleGroup();
            }
        },
        ExtractSignature: function(str) {
            let a = /\[([A-Z]{4}):[0-9A-F]{8}\]/.exec(str);
            return a && a[1];
        }
    });
};
