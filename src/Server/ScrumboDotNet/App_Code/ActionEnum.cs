﻿namespace Tekphoria.Web.Server.Scrumbo
{
    public enum ActionEnum
    {
        UNKNOWN = 0,
        BOARD_ADD,
        BOARD_GET_BY_HASH,
        BOARD_GET,
        BOARD_DELETE,
        BOARD_GET_CONFIGURATION,
        BOARDS_LIST,
        STORY_DELETE,
        STORY_ADD_TO_BOARD,
        STORY_UPDATE,
        TASK_MOVE,
        TASK_GET,
        TASK_DELETE,
        TASK_ADD_TO_STORY,
        TASK_UPDATE_TEXT,
        STORY_GET,
        STORY_UPDATE_TEXT,
        BOARD_SET_CONFIGURATION,
        BOARD_SORT_STORY,
        TASK_UPDATE_STATUS,
        USER_SIGN_IN_TRY,
        USER_ADD,
        USER_ADD_SHARED_BOARD,
        USER_GET,
        USER_UPDATE,
        BOARD_GET_ARCHIVE,
        BOARD_SET_STATUS,
        STORY_SET_STATUS,
        USER_GET_RECENT_TASKS,
        NOTE
    }
}