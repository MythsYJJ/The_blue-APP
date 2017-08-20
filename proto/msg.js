// $> pbjs -t static-module -w commonjs msg.proto
// Generated Mon, 13 Feb 2017 02:51:44 UTC

/*eslint-disable block-scoped-var, no-redeclare, no-control-regex*/
"use strict";

var $protobuf = require("protobufjs/runtime");

// Lazily resolved type references
var $lazyTypes = [];

// Exported root namespace
var $root = {};

$root.imdef = (function() {

    /**
     * Namespace imdef.
     * @exports imdef
     * @namespace
     */
    var imdef = {};

    imdef.ReqAuthentication = (function() {

        /**
         * Constructs a new ReqAuthentication.
         * @exports imdef.ReqAuthentication
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        function ReqAuthentication(properties) {
            if (properties) {
                var keys = Object.keys(properties);
                for (var i = 0; i < keys.length; ++i)
                    this[keys[i]] = properties[keys[i]];
            }
        }

        /** @alias imdef.ReqAuthentication.prototype */
        var $prototype = ReqAuthentication.prototype;

        /**
         * ReqAuthentication sessionId.
         * @type {string}
         */
        $prototype.sessionId = "";

        /**
         * Creates a new ReqAuthentication instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {imdef.ReqAuthentication} ReqAuthentication instance
         */
        ReqAuthentication.create = function create(properties) {
            return new ReqAuthentication(properties);
        };

        /**
         * Encodes the specified ReqAuthentication message.
         * @function
         * @param {imdef.ReqAuthentication|Object} message ReqAuthentication message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReqAuthentication.encode = (function(Writer) { return function encode(message, writer) {
            if (!writer) {
                writer = Writer.create();
            }
            if (message.sessionId !== undefined && message.sessionId !== "") {
                writer.uint32(10).string(message.sessionId);
            }
            return writer;
        };})($protobuf.Writer);

        /**
         * Encodes the specified ReqAuthentication message, length delimited.
         * @param {imdef.ReqAuthentication|Object} message ReqAuthentication message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReqAuthentication.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ReqAuthentication message from the specified reader or buffer.
         * @function
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {imdef.ReqAuthentication} ReqAuthentication
         */
        ReqAuthentication.decode = (function(Reader) { return function decode(reader, len) {
            if (!(reader instanceof Reader)) {
                reader = Reader.create(reader);
            }
            var end = len === undefined ? reader.len : reader.pos + len, message = new $root.imdef.ReqAuthentication();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.sessionId = reader.string();
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };})($protobuf.Reader);

        /**
         * Decodes a ReqAuthentication message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @returns {imdef.ReqAuthentication} ReqAuthentication
         */
        ReqAuthentication.decodeDelimited = function decodeDelimited(readerOrBuffer) {
            readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
            return this.decode(readerOrBuffer, readerOrBuffer.uint32());
        };

        /**
         * Verifies a ReqAuthentication message.
         * @function
         * @param {imdef.ReqAuthentication|Object} message ReqAuthentication message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        ReqAuthentication.verify = (function(util) { return function verify(message) {
            if (message.sessionId !== undefined) {
                if (!util.isString(message.sessionId)) {
                    return "imdef.ReqAuthentication.sessionId: string expected";
                }
            }
            return null;
        };})($protobuf.util);

        /**
         * Converts a ReqAuthentication message.
         * @function
         * @param {imdef.ReqAuthentication|Object} source ReqAuthentication message or plain object to convert
         * @param {*} impl Converter implementation to use
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.ReqAuthentication|Object} Converted message
         */
        ReqAuthentication.convert = (function() { return function convert(src, impl, options) {
            if (!options) {
                options = {};
            }
            var dst = impl.create(src, this, options);
            if (dst) {
                if (dst.sessionId === undefined && options.defaults) {
                    dst.sessionId = "";
                }
            }
            return dst;
        };})();

        /**
         * Creates a ReqAuthentication message from JSON.
         * @param {Object.<string,*>} source Source object
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.ReqAuthentication} ReqAuthentication
         */
        ReqAuthentication.from = function from(source, options) {
            return this.convert(source, $protobuf.converters.message, options);
        };

        /**
         * Converts this ReqAuthentication message to JSON.
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {Object.<string,*>} JSON object
         */
        $prototype.asJSON = function asJSON(options) {
            return this.constructor.convert(this, $protobuf.converters.json, options);
        };

        return ReqAuthentication;
    })();

    imdef.AckAuthentication = (function() {

        /**
         * Constructs a new AckAuthentication.
         * @exports imdef.AckAuthentication
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        function AckAuthentication(properties) {
            if (properties) {
                var keys = Object.keys(properties);
                for (var i = 0; i < keys.length; ++i)
                    this[keys[i]] = properties[keys[i]];
            }
        }

        /** @alias imdef.AckAuthentication.prototype */
        var $prototype = AckAuthentication.prototype;

        /**
         * AckAuthentication errorcode.
         * @type {number}
         */
        $prototype.errorcode = 0;

        /**
         * Creates a new AckAuthentication instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {imdef.AckAuthentication} AckAuthentication instance
         */
        AckAuthentication.create = function create(properties) {
            return new AckAuthentication(properties);
        };

        /**
         * Encodes the specified AckAuthentication message.
         * @function
         * @param {imdef.AckAuthentication|Object} message AckAuthentication message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AckAuthentication.encode = (function(Writer) { return function encode(message, writer) {
            if (!writer) {
                writer = Writer.create();
            }
            if (message.errorcode !== undefined && message.errorcode !== 0) {
                writer.uint32(8).int32(message.errorcode);
            }
            return writer;
        };})($protobuf.Writer);

        /**
         * Encodes the specified AckAuthentication message, length delimited.
         * @param {imdef.AckAuthentication|Object} message AckAuthentication message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AckAuthentication.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AckAuthentication message from the specified reader or buffer.
         * @function
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {imdef.AckAuthentication} AckAuthentication
         */
        AckAuthentication.decode = (function(Reader) { return function decode(reader, len) {
            if (!(reader instanceof Reader)) {
                reader = Reader.create(reader);
            }
            var end = len === undefined ? reader.len : reader.pos + len, message = new $root.imdef.AckAuthentication();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.errorcode = reader.int32();
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };})($protobuf.Reader);

        /**
         * Decodes an AckAuthentication message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @returns {imdef.AckAuthentication} AckAuthentication
         */
        AckAuthentication.decodeDelimited = function decodeDelimited(readerOrBuffer) {
            readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
            return this.decode(readerOrBuffer, readerOrBuffer.uint32());
        };

        /**
         * Verifies an AckAuthentication message.
         * @function
         * @param {imdef.AckAuthentication|Object} message AckAuthentication message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        AckAuthentication.verify = (function(util) { return function verify(message) {
            if (message.errorcode !== undefined) {
                if (!util.isInteger(message.errorcode)) {
                    return "imdef.AckAuthentication.errorcode: integer expected";
                }
            }
            return null;
        };})($protobuf.util);

        /**
         * Converts an AckAuthentication message.
         * @function
         * @param {imdef.AckAuthentication|Object} source AckAuthentication message or plain object to convert
         * @param {*} impl Converter implementation to use
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.AckAuthentication|Object} Converted message
         */
        AckAuthentication.convert = (function() { return function convert(src, impl, options) {
            if (!options) {
                options = {};
            }
            var dst = impl.create(src, this, options);
            if (dst) {
                if (dst.errorcode === undefined && options.defaults) {
                    dst.errorcode = 0;
                }
            }
            return dst;
        };})();

        /**
         * Creates an AckAuthentication message from JSON.
         * @param {Object.<string,*>} source Source object
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.AckAuthentication} AckAuthentication
         */
        AckAuthentication.from = function from(source, options) {
            return this.convert(source, $protobuf.converters.message, options);
        };

        /**
         * Converts this AckAuthentication message to JSON.
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {Object.<string,*>} JSON object
         */
        $prototype.asJSON = function asJSON(options) {
            return this.constructor.convert(this, $protobuf.converters.json, options);
        };

        return AckAuthentication;
    })();

    imdef.ReqSendChatMsg = (function() {

        /**
         * Constructs a new ReqSendChatMsg.
         * @exports imdef.ReqSendChatMsg
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        function ReqSendChatMsg(properties) {
            if (properties) {
                var keys = Object.keys(properties);
                for (var i = 0; i < keys.length; ++i)
                    this[keys[i]] = properties[keys[i]];
            }
        }

        /** @alias imdef.ReqSendChatMsg.prototype */
        var $prototype = ReqSendChatMsg.prototype;

        /**
         * ReqSendChatMsg userId.
         * @type {number|Long}
         */
        $prototype.userId = 0;

        /**
         * ReqSendChatMsg content.
         * @type {string}
         */
        $prototype.content = "";

        /**
         * Creates a new ReqSendChatMsg instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {imdef.ReqSendChatMsg} ReqSendChatMsg instance
         */
        ReqSendChatMsg.create = function create(properties) {
            return new ReqSendChatMsg(properties);
        };

        /**
         * Encodes the specified ReqSendChatMsg message.
         * @function
         * @param {imdef.ReqSendChatMsg|Object} message ReqSendChatMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReqSendChatMsg.encode = (function(Writer) { return function encode(message, writer) {
            if (!writer) {
                writer = Writer.create();
            }
            if (message.userId !== undefined && message.userId !== 0) {
                writer.uint32(8).int64(message.userId);
            }
            if (message.content !== undefined && message.content !== "") {
                writer.uint32(18).string(message.content);
            }
            return writer;
        };})($protobuf.Writer);

        /**
         * Encodes the specified ReqSendChatMsg message, length delimited.
         * @param {imdef.ReqSendChatMsg|Object} message ReqSendChatMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReqSendChatMsg.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ReqSendChatMsg message from the specified reader or buffer.
         * @function
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {imdef.ReqSendChatMsg} ReqSendChatMsg
         */
        ReqSendChatMsg.decode = (function(Reader) { return function decode(reader, len) {
            if (!(reader instanceof Reader)) {
                reader = Reader.create(reader);
            }
            var end = len === undefined ? reader.len : reader.pos + len, message = new $root.imdef.ReqSendChatMsg();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userId = reader.int64();
                    break;

                case 2:
                    message.content = reader.string();
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };})($protobuf.Reader);

        /**
         * Decodes a ReqSendChatMsg message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @returns {imdef.ReqSendChatMsg} ReqSendChatMsg
         */
        ReqSendChatMsg.decodeDelimited = function decodeDelimited(readerOrBuffer) {
            readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
            return this.decode(readerOrBuffer, readerOrBuffer.uint32());
        };

        /**
         * Verifies a ReqSendChatMsg message.
         * @function
         * @param {imdef.ReqSendChatMsg|Object} message ReqSendChatMsg message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        ReqSendChatMsg.verify = (function(util) { return function verify(message) {
            if (message.userId !== undefined) {
                if (!util.isInteger(message.userId) && !(message.userId && util.isInteger(message.userId.low) && util.isInteger(message.userId.high))) {
                    return "imdef.ReqSendChatMsg.userId: integer|Long expected";
                }
            }
            if (message.content !== undefined) {
                if (!util.isString(message.content)) {
                    return "imdef.ReqSendChatMsg.content: string expected";
                }
            }
            return null;
        };})($protobuf.util);

        /**
         * Converts a ReqSendChatMsg message.
         * @function
         * @param {imdef.ReqSendChatMsg|Object} source ReqSendChatMsg message or plain object to convert
         * @param {*} impl Converter implementation to use
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.ReqSendChatMsg|Object} Converted message
         */
        ReqSendChatMsg.convert = (function() { return function convert(src, impl, options) {
            if (!options) {
                options = {};
            }
            var dst = impl.create(src, this, options);
            if (dst) {
                dst.userId = impl.longs(src.userId, 0, 0, false, options);
                if (dst.content === undefined && options.defaults) {
                    dst.content = "";
                }
            }
            return dst;
        };})();

        /**
         * Creates a ReqSendChatMsg message from JSON.
         * @param {Object.<string,*>} source Source object
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.ReqSendChatMsg} ReqSendChatMsg
         */
        ReqSendChatMsg.from = function from(source, options) {
            return this.convert(source, $protobuf.converters.message, options);
        };

        /**
         * Converts this ReqSendChatMsg message to JSON.
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {Object.<string,*>} JSON object
         */
        $prototype.asJSON = function asJSON(options) {
            return this.constructor.convert(this, $protobuf.converters.json, options);
        };

        return ReqSendChatMsg;
    })();

    imdef.AckSendChatMsg = (function() {

        /**
         * Constructs a new AckSendChatMsg.
         * @exports imdef.AckSendChatMsg
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        function AckSendChatMsg(properties) {
            if (properties) {
                var keys = Object.keys(properties);
                for (var i = 0; i < keys.length; ++i)
                    this[keys[i]] = properties[keys[i]];
            }
        }

        /** @alias imdef.AckSendChatMsg.prototype */
        var $prototype = AckSendChatMsg.prototype;

        /**
         * AckSendChatMsg errorcode.
         * @type {number}
         */
        $prototype.errorcode = 0;

        /**
         * AckSendChatMsg createTime.
         * @type {number|Long}
         */
        $prototype.createTime = 0;

        /**
         * Creates a new AckSendChatMsg instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {imdef.AckSendChatMsg} AckSendChatMsg instance
         */
        AckSendChatMsg.create = function create(properties) {
            return new AckSendChatMsg(properties);
        };

        /**
         * Encodes the specified AckSendChatMsg message.
         * @function
         * @param {imdef.AckSendChatMsg|Object} message AckSendChatMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AckSendChatMsg.encode = (function(Writer) { return function encode(message, writer) {
            if (!writer) {
                writer = Writer.create();
            }
            if (message.errorcode !== undefined && message.errorcode !== 0) {
                writer.uint32(8).int32(message.errorcode);
            }
            if (message.createTime !== undefined && message.createTime !== 0) {
                writer.uint32(16).int64(message.createTime);
            }
            return writer;
        };})($protobuf.Writer);

        /**
         * Encodes the specified AckSendChatMsg message, length delimited.
         * @param {imdef.AckSendChatMsg|Object} message AckSendChatMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AckSendChatMsg.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AckSendChatMsg message from the specified reader or buffer.
         * @function
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {imdef.AckSendChatMsg} AckSendChatMsg
         */
        AckSendChatMsg.decode = (function(Reader) { return function decode(reader, len) {
            if (!(reader instanceof Reader)) {
                reader = Reader.create(reader);
            }
            var end = len === undefined ? reader.len : reader.pos + len, message = new $root.imdef.AckSendChatMsg();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.errorcode = reader.int32();
                    break;

                case 2:
                    message.createTime = reader.int64();
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };})($protobuf.Reader);

        /**
         * Decodes an AckSendChatMsg message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @returns {imdef.AckSendChatMsg} AckSendChatMsg
         */
        AckSendChatMsg.decodeDelimited = function decodeDelimited(readerOrBuffer) {
            readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
            return this.decode(readerOrBuffer, readerOrBuffer.uint32());
        };

        /**
         * Verifies an AckSendChatMsg message.
         * @function
         * @param {imdef.AckSendChatMsg|Object} message AckSendChatMsg message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        AckSendChatMsg.verify = (function(util) { return function verify(message) {
            if (message.errorcode !== undefined) {
                if (!util.isInteger(message.errorcode)) {
                    return "imdef.AckSendChatMsg.errorcode: integer expected";
                }
            }
            if (message.createTime !== undefined) {
                if (!util.isInteger(message.createTime) && !(message.createTime && util.isInteger(message.createTime.low) && util.isInteger(message.createTime.high))) {
                    return "imdef.AckSendChatMsg.createTime: integer|Long expected";
                }
            }
            return null;
        };})($protobuf.util);

        /**
         * Converts an AckSendChatMsg message.
         * @function
         * @param {imdef.AckSendChatMsg|Object} source AckSendChatMsg message or plain object to convert
         * @param {*} impl Converter implementation to use
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.AckSendChatMsg|Object} Converted message
         */
        AckSendChatMsg.convert = (function() { return function convert(src, impl, options) {
            if (!options) {
                options = {};
            }
            var dst = impl.create(src, this, options);
            if (dst) {
                if (dst.errorcode === undefined && options.defaults) {
                    dst.errorcode = 0;
                }
                dst.createTime = impl.longs(src.createTime, 0, 0, false, options);
            }
            return dst;
        };})();

        /**
         * Creates an AckSendChatMsg message from JSON.
         * @param {Object.<string,*>} source Source object
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.AckSendChatMsg} AckSendChatMsg
         */
        AckSendChatMsg.from = function from(source, options) {
            return this.convert(source, $protobuf.converters.message, options);
        };

        /**
         * Converts this AckSendChatMsg message to JSON.
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {Object.<string,*>} JSON object
         */
        $prototype.asJSON = function asJSON(options) {
            return this.constructor.convert(this, $protobuf.converters.json, options);
        };

        return AckSendChatMsg;
    })();

    imdef.ReqHeartbeat = (function() {

        /**
         * Constructs a new ReqHeartbeat.
         * @exports imdef.ReqHeartbeat
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        function ReqHeartbeat(properties) {
            if (properties) {
                var keys = Object.keys(properties);
                for (var i = 0; i < keys.length; ++i)
                    this[keys[i]] = properties[keys[i]];
            }
        }

        /** @alias imdef.ReqHeartbeat.prototype */
        var $prototype = ReqHeartbeat.prototype;

        /**
         * Creates a new ReqHeartbeat instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {imdef.ReqHeartbeat} ReqHeartbeat instance
         */
        ReqHeartbeat.create = function create(properties) {
            return new ReqHeartbeat(properties);
        };

        /**
         * Encodes the specified ReqHeartbeat message.
         * @function
         * @param {imdef.ReqHeartbeat|Object} message ReqHeartbeat message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReqHeartbeat.encode = (function(Writer) { return function encode(message, writer) {
            if (!writer) {
                writer = Writer.create();
            }
            return writer;
        };})($protobuf.Writer);

        /**
         * Encodes the specified ReqHeartbeat message, length delimited.
         * @param {imdef.ReqHeartbeat|Object} message ReqHeartbeat message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReqHeartbeat.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ReqHeartbeat message from the specified reader or buffer.
         * @function
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {imdef.ReqHeartbeat} ReqHeartbeat
         */
        ReqHeartbeat.decode = (function(Reader) { return function decode(reader, len) {
            if (!(reader instanceof Reader)) {
                reader = Reader.create(reader);
            }
            var end = len === undefined ? reader.len : reader.pos + len, message = new $root.imdef.ReqHeartbeat();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };})($protobuf.Reader);

        /**
         * Decodes a ReqHeartbeat message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @returns {imdef.ReqHeartbeat} ReqHeartbeat
         */
        ReqHeartbeat.decodeDelimited = function decodeDelimited(readerOrBuffer) {
            readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
            return this.decode(readerOrBuffer, readerOrBuffer.uint32());
        };

        /**
         * Verifies a ReqHeartbeat message.
         * @function
         * @param {imdef.ReqHeartbeat|Object} message ReqHeartbeat message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        ReqHeartbeat.verify = (function() { return function verify() {
            return null;
        };})();

        /**
         * Converts a ReqHeartbeat message.
         * @function
         * @param {imdef.ReqHeartbeat|Object} source ReqHeartbeat message or plain object to convert
         * @param {*} impl Converter implementation to use
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.ReqHeartbeat|Object} Converted message
         */
        ReqHeartbeat.convert = (function() { return function convert(src, impl, options) {
            if (!options) {
                options = {};
            }
            var dst = impl.create(src, this, options);
            return dst;
        };})();

        /**
         * Creates a ReqHeartbeat message from JSON.
         * @param {Object.<string,*>} source Source object
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.ReqHeartbeat} ReqHeartbeat
         */
        ReqHeartbeat.from = function from(source, options) {
            return this.convert(source, $protobuf.converters.message, options);
        };

        /**
         * Converts this ReqHeartbeat message to JSON.
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {Object.<string,*>} JSON object
         */
        $prototype.asJSON = function asJSON(options) {
            return this.constructor.convert(this, $protobuf.converters.json, options);
        };

        return ReqHeartbeat;
    })();

    imdef.AckHeartbeat = (function() {

        /**
         * Constructs a new AckHeartbeat.
         * @exports imdef.AckHeartbeat
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        function AckHeartbeat(properties) {
            if (properties) {
                var keys = Object.keys(properties);
                for (var i = 0; i < keys.length; ++i)
                    this[keys[i]] = properties[keys[i]];
            }
        }

        /** @alias imdef.AckHeartbeat.prototype */
        var $prototype = AckHeartbeat.prototype;

        /**
         * Creates a new AckHeartbeat instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {imdef.AckHeartbeat} AckHeartbeat instance
         */
        AckHeartbeat.create = function create(properties) {
            return new AckHeartbeat(properties);
        };

        /**
         * Encodes the specified AckHeartbeat message.
         * @function
         * @param {imdef.AckHeartbeat|Object} message AckHeartbeat message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AckHeartbeat.encode = (function(Writer) { return function encode(message, writer) {
            if (!writer) {
                writer = Writer.create();
            }
            return writer;
        };})($protobuf.Writer);

        /**
         * Encodes the specified AckHeartbeat message, length delimited.
         * @param {imdef.AckHeartbeat|Object} message AckHeartbeat message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        AckHeartbeat.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an AckHeartbeat message from the specified reader or buffer.
         * @function
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {imdef.AckHeartbeat} AckHeartbeat
         */
        AckHeartbeat.decode = (function(Reader) { return function decode(reader, len) {
            if (!(reader instanceof Reader)) {
                reader = Reader.create(reader);
            }
            var end = len === undefined ? reader.len : reader.pos + len, message = new $root.imdef.AckHeartbeat();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };})($protobuf.Reader);

        /**
         * Decodes an AckHeartbeat message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @returns {imdef.AckHeartbeat} AckHeartbeat
         */
        AckHeartbeat.decodeDelimited = function decodeDelimited(readerOrBuffer) {
            readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
            return this.decode(readerOrBuffer, readerOrBuffer.uint32());
        };

        /**
         * Verifies an AckHeartbeat message.
         * @function
         * @param {imdef.AckHeartbeat|Object} message AckHeartbeat message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        AckHeartbeat.verify = (function() { return function verify() {
            return null;
        };})();

        /**
         * Converts an AckHeartbeat message.
         * @function
         * @param {imdef.AckHeartbeat|Object} source AckHeartbeat message or plain object to convert
         * @param {*} impl Converter implementation to use
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.AckHeartbeat|Object} Converted message
         */
        AckHeartbeat.convert = (function() { return function convert(src, impl, options) {
            if (!options) {
                options = {};
            }
            var dst = impl.create(src, this, options);
            return dst;
        };})();

        /**
         * Creates an AckHeartbeat message from JSON.
         * @param {Object.<string,*>} source Source object
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.AckHeartbeat} AckHeartbeat
         */
        AckHeartbeat.from = function from(source, options) {
            return this.convert(source, $protobuf.converters.message, options);
        };

        /**
         * Converts this AckHeartbeat message to JSON.
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {Object.<string,*>} JSON object
         */
        $prototype.asJSON = function asJSON(options) {
            return this.constructor.convert(this, $protobuf.converters.json, options);
        };

        return AckHeartbeat;
    })();

    imdef.ReceiveChatMsg = (function() {

        /**
         * Constructs a new ReceiveChatMsg.
         * @exports imdef.ReceiveChatMsg
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        function ReceiveChatMsg(properties) {
            if (properties) {
                var keys = Object.keys(properties);
                for (var i = 0; i < keys.length; ++i)
                    this[keys[i]] = properties[keys[i]];
            }
        }

        /** @alias imdef.ReceiveChatMsg.prototype */
        var $prototype = ReceiveChatMsg.prototype;

        /**
         * ReceiveChatMsg userId.
         * @type {number|Long}
         */
        $prototype.userId = 0;

        /**
         * ReceiveChatMsg avatar.
         * @type {string}
         */
        $prototype.avatar = "";

        /**
         * ReceiveChatMsg sex.
         * @type {number}
         */
        $prototype.sex = 0;

        /**
         * ReceiveChatMsg nickName.
         * @type {string}
         */
        $prototype.nickName = "";

        /**
         * ReceiveChatMsg content.
         * @type {string}
         */
        $prototype.content = "";

        /**
         * ReceiveChatMsg createTime.
         * @type {number|Long}
         */
        $prototype.createTime = 0;

        /**
         * Creates a new ReceiveChatMsg instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {imdef.ReceiveChatMsg} ReceiveChatMsg instance
         */
        ReceiveChatMsg.create = function create(properties) {
            return new ReceiveChatMsg(properties);
        };

        /**
         * Encodes the specified ReceiveChatMsg message.
         * @function
         * @param {imdef.ReceiveChatMsg|Object} message ReceiveChatMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReceiveChatMsg.encode = (function(Writer) { return function encode(message, writer) {
            if (!writer) {
                writer = Writer.create();
            }
            if (message.userId !== undefined && message.userId !== 0) {
                writer.uint32(8).int64(message.userId);
            }
            if (message.avatar !== undefined && message.avatar !== "") {
                writer.uint32(18).string(message.avatar);
            }
            if (message.sex !== undefined && message.sex !== 0) {
                writer.uint32(24).int32(message.sex);
            }
            if (message.nickName !== undefined && message.nickName !== "") {
                writer.uint32(34).string(message.nickName);
            }
            if (message.content !== undefined && message.content !== "") {
                writer.uint32(42).string(message.content);
            }
            if (message.createTime !== undefined && message.createTime !== 0) {
                writer.uint32(48).int64(message.createTime);
            }
            return writer;
        };})($protobuf.Writer);

        /**
         * Encodes the specified ReceiveChatMsg message, length delimited.
         * @param {imdef.ReceiveChatMsg|Object} message ReceiveChatMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReceiveChatMsg.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ReceiveChatMsg message from the specified reader or buffer.
         * @function
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {imdef.ReceiveChatMsg} ReceiveChatMsg
         */
        ReceiveChatMsg.decode = (function(Reader) { return function decode(reader, len) {
            if (!(reader instanceof Reader)) {
                reader = Reader.create(reader);
            }
            var end = len === undefined ? reader.len : reader.pos + len, message = new $root.imdef.ReceiveChatMsg();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.userId = reader.int64();
                    break;

                case 2:
                    message.avatar = reader.string();
                    break;

                case 3:
                    message.sex = reader.int32();
                    break;

                case 4:
                    message.nickName = reader.string();
                    break;

                case 5:
                    message.content = reader.string();
                    break;

                case 6:
                    message.createTime = reader.int64();
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };})($protobuf.Reader);

        /**
         * Decodes a ReceiveChatMsg message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @returns {imdef.ReceiveChatMsg} ReceiveChatMsg
         */
        ReceiveChatMsg.decodeDelimited = function decodeDelimited(readerOrBuffer) {
            readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
            return this.decode(readerOrBuffer, readerOrBuffer.uint32());
        };

        /**
         * Verifies a ReceiveChatMsg message.
         * @function
         * @param {imdef.ReceiveChatMsg|Object} message ReceiveChatMsg message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        ReceiveChatMsg.verify = (function(util) { return function verify(message) {
            if (message.userId !== undefined) {
                if (!util.isInteger(message.userId) && !(message.userId && util.isInteger(message.userId.low) && util.isInteger(message.userId.high))) {
                    return "imdef.ReceiveChatMsg.userId: integer|Long expected";
                }
            }
            if (message.avatar !== undefined) {
                if (!util.isString(message.avatar)) {
                    return "imdef.ReceiveChatMsg.avatar: string expected";
                }
            }
            if (message.sex !== undefined) {
                if (!util.isInteger(message.sex)) {
                    return "imdef.ReceiveChatMsg.sex: integer expected";
                }
            }
            if (message.nickName !== undefined) {
                if (!util.isString(message.nickName)) {
                    return "imdef.ReceiveChatMsg.nickName: string expected";
                }
            }
            if (message.content !== undefined) {
                if (!util.isString(message.content)) {
                    return "imdef.ReceiveChatMsg.content: string expected";
                }
            }
            if (message.createTime !== undefined) {
                if (!util.isInteger(message.createTime) && !(message.createTime && util.isInteger(message.createTime.low) && util.isInteger(message.createTime.high))) {
                    return "imdef.ReceiveChatMsg.createTime: integer|Long expected";
                }
            }
            return null;
        };})($protobuf.util);

        /**
         * Converts a ReceiveChatMsg message.
         * @function
         * @param {imdef.ReceiveChatMsg|Object} source ReceiveChatMsg message or plain object to convert
         * @param {*} impl Converter implementation to use
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.ReceiveChatMsg|Object} Converted message
         */
        ReceiveChatMsg.convert = (function() { return function convert(src, impl, options) {
            if (!options) {
                options = {};
            }
            var dst = impl.create(src, this, options);
            if (dst) {
                dst.userId = impl.longs(src.userId, 0, 0, false, options);
                if (dst.avatar === undefined && options.defaults) {
                    dst.avatar = "";
                }
                if (dst.sex === undefined && options.defaults) {
                    dst.sex = 0;
                }
                if (dst.nickName === undefined && options.defaults) {
                    dst.nickName = "";
                }
                if (dst.content === undefined && options.defaults) {
                    dst.content = "";
                }
                dst.createTime = impl.longs(src.createTime, 0, 0, false, options);
            }
            return dst;
        };})();

        /**
         * Creates a ReceiveChatMsg message from JSON.
         * @param {Object.<string,*>} source Source object
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.ReceiveChatMsg} ReceiveChatMsg
         */
        ReceiveChatMsg.from = function from(source, options) {
            return this.convert(source, $protobuf.converters.message, options);
        };

        /**
         * Converts this ReceiveChatMsg message to JSON.
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {Object.<string,*>} JSON object
         */
        $prototype.asJSON = function asJSON(options) {
            return this.constructor.convert(this, $protobuf.converters.json, options);
        };

        return ReceiveChatMsg;
    })();

    imdef.ReceiveOfflineChatMsg = (function() {

        /**
         * Constructs a new ReceiveOfflineChatMsg.
         * @exports imdef.ReceiveOfflineChatMsg
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        function ReceiveOfflineChatMsg(properties) {
            if (properties) {
                var keys = Object.keys(properties);
                for (var i = 0; i < keys.length; ++i)
                    this[keys[i]] = properties[keys[i]];
            }
        }

        /** @alias imdef.ReceiveOfflineChatMsg.prototype */
        var $prototype = ReceiveOfflineChatMsg.prototype;

        /**
         * ReceiveOfflineChatMsg list.
         * @type {Array.<imdef.ReceiveChatMsg>}
         */
        $prototype.list = $protobuf.util.emptyArray;

        // Referenced types
        var $types = ["imdef.ReceiveChatMsg"]; $lazyTypes.push($types);

        /**
         * Creates a new ReceiveOfflineChatMsg instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {imdef.ReceiveOfflineChatMsg} ReceiveOfflineChatMsg instance
         */
        ReceiveOfflineChatMsg.create = function create(properties) {
            return new ReceiveOfflineChatMsg(properties);
        };

        /**
         * Encodes the specified ReceiveOfflineChatMsg message.
         * @function
         * @param {imdef.ReceiveOfflineChatMsg|Object} message ReceiveOfflineChatMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReceiveOfflineChatMsg.encode = (function(Writer, types) { return function encode(message, writer) {
            if (!writer) {
                writer = Writer.create();
            }
            if (message.list) {
                for (var i = 0; i < message.list.length; ++i) {
                    types[0].encode(message.list[i], writer.uint32(10).fork()).ldelim();
                }
            }
            return writer;
        };})($protobuf.Writer, $types);

        /**
         * Encodes the specified ReceiveOfflineChatMsg message, length delimited.
         * @param {imdef.ReceiveOfflineChatMsg|Object} message ReceiveOfflineChatMsg message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReceiveOfflineChatMsg.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ReceiveOfflineChatMsg message from the specified reader or buffer.
         * @function
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {imdef.ReceiveOfflineChatMsg} ReceiveOfflineChatMsg
         */
        ReceiveOfflineChatMsg.decode = (function(Reader, types) { return function decode(reader, len) {
            if (!(reader instanceof Reader)) {
                reader = Reader.create(reader);
            }
            var end = len === undefined ? reader.len : reader.pos + len, message = new $root.imdef.ReceiveOfflineChatMsg();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.list && message.list.length)) {
                        message.list = [];
                    }
                    message.list.push(types[0].decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };})($protobuf.Reader, $types);

        /**
         * Decodes a ReceiveOfflineChatMsg message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @returns {imdef.ReceiveOfflineChatMsg} ReceiveOfflineChatMsg
         */
        ReceiveOfflineChatMsg.decodeDelimited = function decodeDelimited(readerOrBuffer) {
            readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
            return this.decode(readerOrBuffer, readerOrBuffer.uint32());
        };

        /**
         * Verifies a ReceiveOfflineChatMsg message.
         * @function
         * @param {imdef.ReceiveOfflineChatMsg|Object} message ReceiveOfflineChatMsg message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        ReceiveOfflineChatMsg.verify = (function(types) { return function verify(message) {
            if (message.list !== undefined) {
                if (!Array.isArray(message.list)) {
                    return "imdef.ReceiveOfflineChatMsg.list: array expected";
                }
                for (var i = 0; i < message.list.length; ++i) {
                    var err;
                    if (err = types[0].verify(message.list[i])) {
                        return err;
                    }
                }
            }
            return null;
        };})($types);

        /**
         * Converts a ReceiveOfflineChatMsg message.
         * @function
         * @param {imdef.ReceiveOfflineChatMsg|Object} source ReceiveOfflineChatMsg message or plain object to convert
         * @param {*} impl Converter implementation to use
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.ReceiveOfflineChatMsg|Object} Converted message
         */
        ReceiveOfflineChatMsg.convert = (function(types) { return function convert(src, impl, options) {
            if (!options) {
                options = {};
            }
            var dst = impl.create(src, this, options);
            if (dst) {
                if (src.list && src.list.length) {
                    dst.list = [];
                    for (var i = 0; i < src.list.length; ++i) {
                        dst.list.push(types[0].convert(src.list[i], impl, options));
                    }
                } else {
                    if (options.defaults || options.arrays) {
                        dst.list = [];
                    }
                }
            }
            return dst;
        };})($types);

        /**
         * Creates a ReceiveOfflineChatMsg message from JSON.
         * @param {Object.<string,*>} source Source object
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.ReceiveOfflineChatMsg} ReceiveOfflineChatMsg
         */
        ReceiveOfflineChatMsg.from = function from(source, options) {
            return this.convert(source, $protobuf.converters.message, options);
        };

        /**
         * Converts this ReceiveOfflineChatMsg message to JSON.
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {Object.<string,*>} JSON object
         */
        $prototype.asJSON = function asJSON(options) {
            return this.constructor.convert(this, $protobuf.converters.json, options);
        };

        return ReceiveOfflineChatMsg;
    })();

    imdef.Notification = (function() {

        /**
         * Constructs a new Notification.
         * @exports imdef.Notification
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        function Notification(properties) {
            if (properties) {
                var keys = Object.keys(properties);
                for (var i = 0; i < keys.length; ++i)
                    this[keys[i]] = properties[keys[i]];
            }
        }

        /** @alias imdef.Notification.prototype */
        var $prototype = Notification.prototype;

        /**
         * Notification noticeType.
         * @type {number}
         */
        $prototype.noticeType = 0;

        /**
         * Notification content.
         * @type {string}
         */
        $prototype.content = "";

        /**
         * Notification parameters.
         * @type {string}
         */
        $prototype.parameters = "";

        /**
         * Notification createTime.
         * @type {number|Long}
         */
        $prototype.createTime = 0;

        /**
         * Creates a new Notification instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {imdef.Notification} Notification instance
         */
        Notification.create = function create(properties) {
            return new Notification(properties);
        };

        /**
         * Encodes the specified Notification message.
         * @function
         * @param {imdef.Notification|Object} message Notification message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Notification.encode = (function(Writer) { return function encode(message, writer) {
            if (!writer) {
                writer = Writer.create();
            }
            if (message.noticeType !== undefined && message.noticeType !== 0) {
                writer.uint32(8).int32(message.noticeType);
            }
            if (message.content !== undefined && message.content !== "") {
                writer.uint32(18).string(message.content);
            }
            if (message.parameters !== undefined && message.parameters !== "") {
                writer.uint32(26).string(message.parameters);
            }
            if (message.createTime !== undefined && message.createTime !== 0) {
                writer.uint32(32).int64(message.createTime);
            }
            return writer;
        };})($protobuf.Writer);

        /**
         * Encodes the specified Notification message, length delimited.
         * @param {imdef.Notification|Object} message Notification message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Notification.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Notification message from the specified reader or buffer.
         * @function
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {imdef.Notification} Notification
         */
        Notification.decode = (function(Reader) { return function decode(reader, len) {
            if (!(reader instanceof Reader)) {
                reader = Reader.create(reader);
            }
            var end = len === undefined ? reader.len : reader.pos + len, message = new $root.imdef.Notification();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.noticeType = reader.int32();
                    break;

                case 2:
                    message.content = reader.string();
                    break;

                case 3:
                    message.parameters = reader.string();
                    break;

                case 4:
                    message.createTime = reader.int64();
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };})($protobuf.Reader);

        /**
         * Decodes a Notification message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @returns {imdef.Notification} Notification
         */
        Notification.decodeDelimited = function decodeDelimited(readerOrBuffer) {
            readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
            return this.decode(readerOrBuffer, readerOrBuffer.uint32());
        };

        /**
         * Verifies a Notification message.
         * @function
         * @param {imdef.Notification|Object} message Notification message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        Notification.verify = (function(util) { return function verify(message) {
            if (message.noticeType !== undefined) {
                if (!util.isInteger(message.noticeType)) {
                    return "imdef.Notification.noticeType: integer expected";
                }
            }
            if (message.content !== undefined) {
                if (!util.isString(message.content)) {
                    return "imdef.Notification.content: string expected";
                }
            }
            if (message.parameters !== undefined) {
                if (!util.isString(message.parameters)) {
                    return "imdef.Notification.parameters: string expected";
                }
            }
            if (message.createTime !== undefined) {
                if (!util.isInteger(message.createTime) && !(message.createTime && util.isInteger(message.createTime.low) && util.isInteger(message.createTime.high))) {
                    return "imdef.Notification.createTime: integer|Long expected";
                }
            }
            return null;
        };})($protobuf.util);

        /**
         * Converts a Notification message.
         * @function
         * @param {imdef.Notification|Object} source Notification message or plain object to convert
         * @param {*} impl Converter implementation to use
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.Notification|Object} Converted message
         */
        Notification.convert = (function() { return function convert(src, impl, options) {
            if (!options) {
                options = {};
            }
            var dst = impl.create(src, this, options);
            if (dst) {
                if (dst.noticeType === undefined && options.defaults) {
                    dst.noticeType = 0;
                }
                if (dst.content === undefined && options.defaults) {
                    dst.content = "";
                }
                if (dst.parameters === undefined && options.defaults) {
                    dst.parameters = "";
                }
                dst.createTime = impl.longs(src.createTime, 0, 0, false, options);
            }
            return dst;
        };})();

        /**
         * Creates a Notification message from JSON.
         * @param {Object.<string,*>} source Source object
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.Notification} Notification
         */
        Notification.from = function from(source, options) {
            return this.convert(source, $protobuf.converters.message, options);
        };

        /**
         * Converts this Notification message to JSON.
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {Object.<string,*>} JSON object
         */
        $prototype.asJSON = function asJSON(options) {
            return this.constructor.convert(this, $protobuf.converters.json, options);
        };

        return Notification;
    })();

    imdef.ReceiveOfflineNotification = (function() {

        /**
         * Constructs a new ReceiveOfflineNotification.
         * @exports imdef.ReceiveOfflineNotification
         * @constructor
         * @param {Object} [properties] Properties to set
         */
        function ReceiveOfflineNotification(properties) {
            if (properties) {
                var keys = Object.keys(properties);
                for (var i = 0; i < keys.length; ++i)
                    this[keys[i]] = properties[keys[i]];
            }
        }

        /** @alias imdef.ReceiveOfflineNotification.prototype */
        var $prototype = ReceiveOfflineNotification.prototype;

        /**
         * ReceiveOfflineNotification list.
         * @type {Array.<imdef.Notification>}
         */
        $prototype.list = $protobuf.util.emptyArray;

        // Referenced types
        var $types = ["imdef.Notification"]; $lazyTypes.push($types);

        /**
         * Creates a new ReceiveOfflineNotification instance using the specified properties.
         * @param {Object} [properties] Properties to set
         * @returns {imdef.ReceiveOfflineNotification} ReceiveOfflineNotification instance
         */
        ReceiveOfflineNotification.create = function create(properties) {
            return new ReceiveOfflineNotification(properties);
        };

        /**
         * Encodes the specified ReceiveOfflineNotification message.
         * @function
         * @param {imdef.ReceiveOfflineNotification|Object} message ReceiveOfflineNotification message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReceiveOfflineNotification.encode = (function(Writer, types) { return function encode(message, writer) {
            if (!writer) {
                writer = Writer.create();
            }
            if (message.list) {
                for (var i = 0; i < message.list.length; ++i) {
                    types[0].encode(message.list[i], writer.uint32(10).fork()).ldelim();
                }
            }
            return writer;
        };})($protobuf.Writer, $types);

        /**
         * Encodes the specified ReceiveOfflineNotification message, length delimited.
         * @param {imdef.ReceiveOfflineNotification|Object} message ReceiveOfflineNotification message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        ReceiveOfflineNotification.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a ReceiveOfflineNotification message from the specified reader or buffer.
         * @function
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {imdef.ReceiveOfflineNotification} ReceiveOfflineNotification
         */
        ReceiveOfflineNotification.decode = (function(Reader, types) { return function decode(reader, len) {
            if (!(reader instanceof Reader)) {
                reader = Reader.create(reader);
            }
            var end = len === undefined ? reader.len : reader.pos + len, message = new $root.imdef.ReceiveOfflineNotification();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.list && message.list.length)) {
                        message.list = [];
                    }
                    message.list.push(types[0].decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };})($protobuf.Reader, $types);

        /**
         * Decodes a ReceiveOfflineNotification message from the specified reader or buffer, length delimited.
         * @param {$protobuf.Reader|Uint8Array} readerOrBuffer Reader or buffer to decode from
         * @returns {imdef.ReceiveOfflineNotification} ReceiveOfflineNotification
         */
        ReceiveOfflineNotification.decodeDelimited = function decodeDelimited(readerOrBuffer) {
            readerOrBuffer = readerOrBuffer instanceof $protobuf.Reader ? readerOrBuffer : $protobuf.Reader(readerOrBuffer);
            return this.decode(readerOrBuffer, readerOrBuffer.uint32());
        };

        /**
         * Verifies a ReceiveOfflineNotification message.
         * @function
         * @param {imdef.ReceiveOfflineNotification|Object} message ReceiveOfflineNotification message or plain object to verify
         * @returns {?string} `null` if valid, otherwise the reason why it is not
         */
        ReceiveOfflineNotification.verify = (function(types) { return function verify(message) {
            if (message.list !== undefined) {
                if (!Array.isArray(message.list)) {
                    return "imdef.ReceiveOfflineNotification.list: array expected";
                }
                for (var i = 0; i < message.list.length; ++i) {
                    var err;
                    if (err = types[0].verify(message.list[i])) {
                        return err;
                    }
                }
            }
            return null;
        };})($types);

        /**
         * Converts a ReceiveOfflineNotification message.
         * @function
         * @param {imdef.ReceiveOfflineNotification|Object} source ReceiveOfflineNotification message or plain object to convert
         * @param {*} impl Converter implementation to use
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.ReceiveOfflineNotification|Object} Converted message
         */
        ReceiveOfflineNotification.convert = (function(types) { return function convert(src, impl, options) {
            if (!options) {
                options = {};
            }
            var dst = impl.create(src, this, options);
            if (dst) {
                if (src.list && src.list.length) {
                    dst.list = [];
                    for (var i = 0; i < src.list.length; ++i) {
                        dst.list.push(types[0].convert(src.list[i], impl, options));
                    }
                } else {
                    if (options.defaults || options.arrays) {
                        dst.list = [];
                    }
                }
            }
            return dst;
        };})($types);

        /**
         * Creates a ReceiveOfflineNotification message from JSON.
         * @param {Object.<string,*>} source Source object
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {imdef.ReceiveOfflineNotification} ReceiveOfflineNotification
         */
        ReceiveOfflineNotification.from = function from(source, options) {
            return this.convert(source, $protobuf.converters.message, options);
        };

        /**
         * Converts this ReceiveOfflineNotification message to JSON.
         * @param {Object.<string,*>} [options] Conversion options
         * @returns {Object.<string,*>} JSON object
         */
        $prototype.asJSON = function asJSON(options) {
            return this.constructor.convert(this, $protobuf.converters.json, options);
        };

        return ReceiveOfflineNotification;
    })();

    return imdef;
})();

// Resolve lazy types
$lazyTypes.forEach(function(types) {
    types.forEach(function(path, i) {
        if (!path)
            return;
        path = path.split(".");
        var ptr = $root;
        while (path.length)
            ptr = ptr[path.shift()];
        types[i] = ptr;
    });
});

$protobuf.roots["default"] = $root;

module.exports = $root;
