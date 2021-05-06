const state = {
    customClass: 'zZindex'
};

const mutations = {
    toggleCustomClass(state, value = 'zZindex') {
        state.customClass = value;
    }
};

export default {
    state,
    mutations
}