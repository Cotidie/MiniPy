export default module = {
  // namespace가 존재하므로 사용할때는 {등록시킬때이름/}를 추가해줘서 사용해야 한다
  namespaced: true,
  state: () => ({
    showDrawer: true,  // Manage 페이지의 NavigationDrawer 상태값
    statData: {}        // 통계창에 표시할 데이터
  }),
  mutations: {
    setDrawer(state, value) { // showDrawer 값 변경
      state.showDrawer = value;
    },
    setStatData(state, value) { // StatData 값 할당
      state.statData = value
    }
  },
  actions: {
    toggleDrawer({state, commit}) {
      commit('setDrawer', (state.showDrawer ? false : true));
    },
    openDrawer({state, commit}) {
      commit('setDrawer', true);
    },
    closeDrawer({state, commit}) {
      commit('setDrawer', false);
    }
  },
  getters: {
    /* 전역적으로 모듈들이 동일한 포맷의 mutations를 사용할 때 이곳에 등록해서 사용한다 */
  }
}

