import { sessionStore } from '@/utils';

const state = {
    sidebar: {
        isCollapse: sessionStore.get('sidebarStatus')
            ? !!+sessionStore.get('sidebarStatus')
            : false,
        withoutAnimation: false
    }
};

const mutations = {
    TOGGLE_SIDEBAR: (state, value) => {
        if (value !== undefined) {
            // console.log(value);
            state.sidebar.isCollapse = value;
        } else {
            state.sidebar.isCollapse = !state.sidebar.isCollapse;
        }
        state.sidebar.withoutAnimation = false;
        if (state.sidebar.isCollapse) {
            sessionStore.set('sidebarStatus', 1);
        } else {
            sessionStore.set('sidebarStatus', 0);
        }
    }
};

const actions = {};

export default {
    state,
    mutations,
    actions
};
