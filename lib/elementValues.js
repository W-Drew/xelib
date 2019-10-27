module.exports = function(lib, xelib, helpers) {
    let { elementContext, Fail, flagContext, GetNativeValue, GetNativeValueEx, GetBool, GetString,
        GetDictionary, GetStringValue, SetNativeValue, wcb } = helpers;

    // ELEMENT VALUE METHODS
    Object.assign(xelib, {
        Name: function(id) {
            return GetStringValue(id, 'Name');
        },
        LongName: function(id) {
            return GetStringValue(id, 'LongName');
        },
        DisplayName: function(id) {
            return GetStringValue(id, 'DisplayName');
        },
        PlacementName: function(id) {
            return xelib.WithHandle(xelib.GetLinksTo(id, 'NAME'), rec => {
                return rec > 0 && `Places ${xelib.Name(rec)}`;
            });
        },
        Path: function(id) {
            return GetString(function(_len) {
                if (!lib.Path(id, true, false, false, _len))
                    Fail(`Path failed on ${id}`);
            });
        },
        LongPath: function(id) {
            return GetString(function(_len) {
                if (!lib.Path(id, false, false, false, _len))
                    Fail(`Path failed on ${id}`);
            });
        },
        LocalPath: function(id) {
            return GetString(function(_len) {
                if (!lib.Path(id, false, true, false, _len))
                    Fail(`Path failed on ${id}`);
            });
        },
        SortPath: function(id) {
            return GetString(function(_len) {
                if (!lib.Path(id, false, true, true, _len))
                    Fail(`Path failed on ${id}`);
            });
        },
        PathName: function(id, sort = false) {
            return GetString(function(_len) {
                if (!lib.PathName(id, sort, _len))
                    Fail(`PathName failed on ${id}`);
            });
        },
        Signature: function(id) {
            return GetStringValue(id, 'Signature');
        },
        SortKey: function(id) {
            return GetStringValue(id, 'SortKey');
        },
        GetValue: function(id, path = '') {
            return GetString((_len) => lib.GetValue(id, wcb(path), _len));
        },
        GetValueEx: function(id, path = '') {
            return GetString(function(_len) {
                if (!lib.GetValue(id, wcb(path), _len))
                    Fail(() => `Failed to get element value at: ${elementContext(id, path)}`);
            });
        },
        SetValue: function(id, path, value) {
            if (value === undefined) {
                value = path;
                path = '';
            }
            if (!lib.SetValue(id, wcb(path), wcb(value)))
                Fail(() => `Failed to set element value at: ${elementContext(id, path)}`);
        },
        GetIntValue: function(id, path = '') {
            return GetNativeValue(id, path, 'GetIntValue', 4).readInt32LE();
        },
        GetIntValueEx: function(id, path = '') {
            return GetNativeValueEx(id, path, 'GetIntValue', 4).readInt32LE();
        },
        SetIntValue: function(id, path, value) {
            SetNativeValue(id, path, 'SetIntValue', value);
        },
        GetUIntValue: function(id, path = '') {
            return GetNativeValue(id, path, 'GetUIntValue', 4).readUInt32LE();
        },
        GetUIntValueEx: function(_id, path = '') {
            return GetNativeValueEx(_id, path, 'GetUIntValue', 4).readUInt32LE();
        },
        SetUIntValue: function(id, path, value) {
            SetNativeValue(id, path, 'SetUIntValue', value);
        },
        GetFloatValue: function(id, path = '') {
            return GetNativeValue(id, path, 'GetFloatValue', 8).readDoubleLE();
        },
        GetFloatValueEx: function(id, path = '') {
            return GetNativeValueEx(id, path, 'GetFloatValue', 8).readDoubleLE();
        },
        SetFloatValue: function(id, path, value) {
            SetNativeValue(id, path, 'SetFloatValue', value);
        },
        SetFlag: function(id, path, name, state) {
            if (!lib.SetFlag(id, wcb(path), wcb(name), state))
                Fail(() => `Failed to set flag value at: ${flagContext(id, path, name)} to ${state}`);
        },
        GetFlag: function(id, path, name) {
            return GetBool(function(_bool) {
                if (!lib.GetFlag(id, wcb(path), wcb(name), _bool))
                    Fail(() => `Failed to get flag value at: ${flagContext(id, path, name)}`);
            });
        },
        GetEnabledFlags: function(id, path = '') {
            return GetString(function(_len) {
                if (!lib.GetEnabledFlags(id, wcb(path), _len))
                    Fail(() => `Failed to get enabled flags at: ${elementContext(id, path)}`);
            }).split(',');
        },
        SetEnabledFlags: function(id, path, flags) {
            if (!lib.SetEnabledFlags(id, wcb(path), wcb(flags.join(','))))
                Fail(() => `Failed to set enabled flags at: ${elementContext(id, path)}`);
        },
        GetAllFlags: function(id, path = '') {
            return GetString(function(_len) {
                if (!lib.GetAllFlags(id, wcb(path), _len))
                    Fail(() => `Failed to get all flags at: ${elementContext(id, path)}`);
            }).split(',');
        },
        GetEnumOptions: function(id, path = '') {
            return GetString(function(_len) {
                if (!lib.GetEnumOptions(id, wcb(path), _len))
                    Fail(() => `Failed to get all enum options at: ${elementContext(id, path)}`);
            }).split(',');
        },
        SignatureFromName: function(name) {
            return GetString(function(_len) {
                if (!lib.SignatureFromName(wcb(name), _len))
                    Fail(`Failed to get signature from name: ${name}`);
            });
        },
        NameFromSignature: function(sig) {
            return GetString(function(_len) {
                if (!lib.NameFromSignature(wcb(sig), _len))
                    Fail(`Failed to get name from signature: ${sig}`);
            });
        },
        GetSignatureNameMap: function() {
            return GetDictionary(function(_len) {
                if (!lib.GetSignatureNameMap(_len))
                    Fail(`Failed to get signature name map`);
            });
        }
    });
};
