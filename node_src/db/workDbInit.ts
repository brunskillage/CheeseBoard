import Sequelize from 'sequelize'
import path from 'path'


export const sequelize = new Sequelize('database', 'username', 'password', {
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
    storage: path.join(__dirname, '/work.sqlite')
});

export class WorkDbInit{

    public check(){

      sequelize
      .authenticate()
      .then(() => {
        console.log('Database connection to has been established successfully.');
      })
      .catch((err : any) => {
          console.error('Unable to connect to the database:', err);  
      });
    

    }

    public migrate() {



        // User.hasMany(Board)
        // Board.hasMany(Task)
        // Task.belongsTo(User)


        sequelize.sync({force:true}).then(()=>{
          console.log("DB Synced")
        })
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


    }
}

// these are the models representing the tables

export const UserBoard = sequelize.define('user_boards', {
      id: {
        type: Sequelize.INTEGER, primaryKey: true, autoIncrement : true
      },
      user_id: {
        type: Sequelize.INTEGER, allowNull: true
      },
      board_hash: {
        type: Sequelize.TEXT, allowNull: true
      },
      sort_order: {
        type: Sequelize.INTEGER, defaultValue : 1
      }
    },

    {underscored: true, timestamps: false}

);

export const BackLog = sequelize.define('backlog', {
    id: {
      type: Sequelize.INTEGER, primaryKey: true, autoIncrement : true
    },
    nameof: {
      type: Sequelize.TEXT, allowNull: true
    },
    textof: {
      type: Sequelize.TEXT, allowNull: true
    },
    date_created : { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
  },
  {underscored: true, timestamps: false}
);


export const Board = sequelize.define('boards', {
  id: {
    type: Sequelize.INTEGER, primaryKey: true, autoIncrement : true
  },
  nameof: {
    type: Sequelize.TEXT
  },
  hash: {
    type: Sequelize.TEXT
  },
  group_hash: {
    type: Sequelize.TEXT
  },
  extra_status_1: {
    type: Sequelize.TEXT
  },
  extra_status_2: {
    type: Sequelize.TEXT
  },
  more_info: {
    type: Sequelize.TEXT
  },
  row_header_name: {
    type: Sequelize.TEXT
  },
  custom_css: {
    type: Sequelize.TEXT
  },
},
{underscored: true, timestamps: false}
);



export const Story = sequelize.define('stories', {
  id: {
    type: Sequelize.INTEGER, primaryKey: true, autoIncrement : true
  },
  textof: {
    type: Sequelize.TEXT, allowNull:false
  },
  board_id: {
    type: Sequelize.INTEGER
  },
  sort_order: {
    type: Sequelize.INTEGER
  },
  date_done: {
    type: Sequelize.DATE
  },
  status: {
    type: Sequelize.INTEGER
  }

},
{underscored: true, timestamps: false}
);


export const Task = sequelize.define('tasks', {
  id: {
    type: Sequelize.INTEGER, primaryKey: true, autoIncrement : true
  },
  textof: {
    type: Sequelize.TEXT, allowNull:false
  },
  story_id: {
    type: Sequelize.INTEGER
  },
  board_id: {
    type: Sequelize.INTEGER
  },
  sort_order: {
    type: Sequelize.INTEGER
  },
  status: {
    type: Sequelize.TEXT
  },
  css_class: {
    type: Sequelize.TEXT
  },
  user_id: {
    type: Sequelize.INTEGER
  },
  date_done: {
    type: Sequelize.DATE
  },
  note_count: {
    type: Sequelize.INTEGER
  },
},
{underscored: true, timestamps: false}
);

export const User = sequelize.define('users', {
  id: {
    type: Sequelize.INTEGER, primaryKey: true, autoIncrement : true
  },
  nameof: {
    type: Sequelize.TEXT, allowNull:false
  },
  status: {
    type: Sequelize.TEXT
  },
},
{underscored: true, timestamps: false}
);


