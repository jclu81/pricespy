import createHistory from 'history/createMemoryHistory'

export default createHistory({
    initialEntries: ['/'],
    initialIndex: 0
})

// import createHistory from 'history/createBrowserHistory'
//
// export default createHistory({
//     forceRefresh: true
// })