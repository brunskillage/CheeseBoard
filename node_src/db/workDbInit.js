"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
var sequelize_1 = __importDefault(require("sequelize"));
var path_1 = __importDefault(require("path"));
exports.sequelize = new sequelize_1.default('database', 'username', 'password', {
    host: 'localhost',
    //dialect: 'mysql'|'sqlite'|'postgres'|'mssql',
    dialect: 'sqlite',
    operatorsAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    // SQLite only
    storage: path_1.default.join(__dirname, '/work.sqlite')
});
var WorkDbInit = /** @class */ (function () {
    function WorkDbInit() {
    }
    WorkDbInit.prototype.check = function () {
        exports.sequelize
            .authenticate()
            .then(function () {
            console.log('Database connection to has been established successfully.');
        })
            .catch(function (err) {
            console.error('Unable to connect to the database:', err);
        });
    };
    WorkDbInit.prototype.migrate = function () {
        // User.hasMany(Board)
        // Board.hasMany(Task)
        // Task.belongsTo(User)
        exports.sequelize.sync({ force: true }).then(function () {
            console.log("DB Synced");
        });
        // Project.sync().then(() => {
        //     console.log("Database sync ok")
        //   }).catch((error : any) => {
        //     console.log("Error: " + error)
        //  })
        // WorkItem.belongsTo(Project)
        // Project.sync({force: true}).then(() => {
        //   // Table created
        //     Project.create({
        //       id: 1,
        //       project: 'House Extension',
        //       note: 'Make the extension',
        //       priority: 1,
        //       status: 'INPROGRESS',
        //     });
        // });
    };
    return WorkDbInit;
}());
exports.WorkDbInit = WorkDbInit;
// these are the models representing the tables
exports.UserBoard = exports.sequelize.define('user_boards', {
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
exports.BackLog = exports.sequelize.define('backlog', {
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
exports.Board = exports.sequelize.define('boards', {
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
exports.Story = exports.sequelize.define('stories', {
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
    status: {
        type: sequelize_1.default.INTEGER
    }
}, { underscored: true, timestamps: false });
exports.Task = exports.sequelize.define('tasks', {
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
    note_count: {
        type: sequelize_1.default.INTEGER
    },
}, { underscored: true, timestamps: false });
exports.User = exports.sequelize.define('users', {
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
