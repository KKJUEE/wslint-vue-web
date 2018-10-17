//test
export const increment = ({commit}) => {
    commit('INCREMENT')
}
export const decrement = ({commit}) => {
    commit('DECREMENT')
}
export const addaction = ({commit}) => {
    commit('ADDACTION')
}
export const editaction = ({commit}) => {
    commit('EDITACTION')
}
export const delaction = ({commit}) => {
    commit('DELACTION')
}
export const clickaction = ({commit}) => {
    commit('CLICKACTION')
}
export const newMessage = ({commit}, msg) => {
    commit('NEW_MESSAGE', msg)
}