module.exports = function(lib, xelib, helpers) {
    // RECORD VALUE METHODS
    Object.assign(xelib, {
        EditorID: function(id) {
            return xelib.GetValue(id, 'EDID');
        },
        FullName: function(id) {
            return xelib.GetValue(id, 'FULL');
        },
        GetRefEditorID: function(id, path) {
            return xelib.WithHandle(xelib.GetLinksTo(id, path), linked => {
                return linked ? xelib.EditorID(linked) : '';
            });
        },
        Translate: function(id, vector) {
            let position = xelib.GetElement(id, 'DATA\\Position');
            ['X', 'Y', 'Z'].forEach(function(coord) {
                if (!vector.hasOwnProperty(coord)) return;
                let newValue = xelib.GetFloatValue(position, coord) + vector[coord];
                xelib.SetFloatValue(position, coord, newValue);
            });
        },
        Rotate: function(id, vector) {
            let rotation = xelib.GetElement(id, 'DATA\\Rotation');
            ['X', 'Y', 'Z'].forEach(function(coord) {
                if (!vector.hasOwnProperty(coord)) return;
                let newValue = xelib.GetFloatValue(rotation, coord) + vector[coord];
                xelib.SetFloatValue(rotation, coord, newValue);
            });
        },
        GetRecordFlag: function(id, name) {
            return xelib.GetFlag(id, 'Record Header\\Record Flags', name);
        },
        SetRecordFlag: function(id, name, state) {
            xelib.SetFlag(id, 'Record Header\\Record Flags', name, state);
        }
    });
};
