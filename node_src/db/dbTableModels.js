"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = __importDefault(require("sequelize"));
var app_1 = require("../app");
// these are the models representing the tables
exports.UserBoard = app_1.sequelize.define('user_boards', {
    id: {
        type: sequelize_1.default.INTEGER, primaryKey: true, autoIncrement: true
    },
    user_id: {
        type: sequelize_1.default.INTEGER, allowNull: true
    },
    board_hash: {
        type: sequelize_1.default.TEXT, allowNull: true
    },
    sort_order: {
        type: sequelize_1.default.INTEGER, defaultValue: 1
    }
}, { underscored: true, timestamps: false });
exports.BackLog = app_1.sequelize.define('backlog', {
    id: {
        type: sequelize_1.default.INTEGER, primaryKey: true, autoIncrement: true
    },
    nameof: {
        type: sequelize_1.default.TEXT, allowNull: true
    },
    textof: {
        type: sequelize_1.default.TEXT, allowNull: true
    },
    date_created: { type: sequelize_1.default.DATE, defaultValue: sequelize_1.default.NOW }
}, { underscored: true, timestamps: false });
exports.Board = app_1.sequelize.define('boards', {
    id: {
        type: sequelize_1.default.INTEGER, primaryKey: true, autoIncrement: true
    },
    nameof: {
        type: sequelize_1.default.TEXT
    },
    hash: {
        type: sequelize_1.default.TEXT
    },
    group_hash: {
        type: sequelize_1.default.TEXT
    },
    extra_status_1: {
        type: sequelize_1.default.TEXT
    },
    extra_status_2: {
        type: sequelize_1.default.TEXT
    },
    more_info: {
        type: sequelize_1.default.TEXT
    },
    row_header_name: {
        type: sequelize_1.default.TEXT
    },
    custom_css: {
        type: sequelize_1.default.TEXT
    },
}, { underscored: true, timestamps: false });
exports.Story = app_1.sequelize.define('stories', {
    id: {
        type: sequelize_1.default.INTEGER, primaryKey: true, autoIncrement: true
    },
    textof: {
        type: sequelize_1.default.TEXT, allowNull: false
    },
    board_id: {
        type: sequelize_1.default.INTEGER
    },
    sort_order: {
        type: sequelize_1.default.INTEGER
    },
    date_done: {
        type: sequelize_1.default.DATE
    },
    date_created: {
        type: sequelize_1.default.DATE, defaultValue: sequelize_1.default.NOW
    },
    status: {
        type: sequelize_1.default.INTEGER
    }
}, { underscored: true, timestamps: false });
exports.LogItem = app_1.sequelize.define('log_items', {
    id: {
        type: sequelize_1.default.INTEGER, primaryKey: true, autoIncrement: true
    },
    task_id: { type: sequelize_1.default.INTEGER },
    textof: {
        type: sequelize_1.default.TEXT
    },
    action: {
        type: sequelize_1.default.INTEGER
    },
    board_id: {
        type: sequelize_1.default.INTEGER
    }
}, { underscored: true, timestamps: false });
exports.Task = app_1.sequelize.define('tasks', {
    id: {
        type: sequelize_1.default.INTEGER, primaryKey: true, autoIncrement: true
    },
    textof: {
        type: sequelize_1.default.TEXT, allowNull: false
    },
    story_id: {
        type: sequelize_1.default.INTEGER
    },
    board_id: {
        type: sequelize_1.default.INTEGER
    },
    sort_order: {
        type: sequelize_1.default.INTEGER
    },
    status: {
        type: sequelize_1.default.TEXT
    },
    css_class: {
        type: sequelize_1.default.TEXT
    },
    user_id: {
        type: sequelize_1.default.INTEGER
    },
    date_done: {
        type: sequelize_1.default.DATE
    },
    date_created: {
        type: sequelize_1.default.DATE, defaultValue: sequelize_1.default.NOW
    },
    date_modified: {
        type: sequelize_1.default.DATE, defaultValue: sequelize_1.default.NOW
    },
    note_count: {
        type: sequelize_1.default.INTEGER
    },
}, { underscored: true, timestamps: false });
exports.User = app_1.sequelize.define('users', {
    id: {
        type: sequelize_1.default.INTEGER, primaryKey: true, autoIncrement: true
    },
    nameof: {
        type: sequelize_1.default.TEXT, allowNull: false
    },
    status: {
        type: sequelize_1.default.TEXT
    },
}, { underscored: true, timestamps: false });
