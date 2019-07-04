import Sequelize from 'sequelize'
import dbService from './../db/dbService'
import path from 'path'
import { sequelize } from '../app';

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
date_created: {
  type: Sequelize.DATE, defaultValue: Sequelize.NOW 
},
status: {
  type: Sequelize.INTEGER
}

},
{underscored: true, timestamps: false}
);

export const LogItem = sequelize.define('log_items',{
  id: {
    type: Sequelize.INTEGER, primaryKey: true, autoIncrement : true
  },
  task_id: {type: Sequelize.INTEGER},
  textof: {
    type: Sequelize.TEXT
  },
  action: {
    type: Sequelize.INTEGER
  },
  board_id: {
    type: Sequelize.INTEGER
  }
},
{underscored: true, timestamps: false}
)

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
date_created: {
  type: Sequelize.DATE, defaultValue: Sequelize.NOW
},
date_modified: {
  type: Sequelize.DATE, defaultValue: Sequelize.NOW
},
note_count: {
  type: Sequelize.INTEGER
},
},
{underscored: true, timestamps: false}
);

export const User :any = sequelize.define('users', {
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