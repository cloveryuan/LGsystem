const config = {
  timeout: 9000,
  TokenKey: 'ACCESS_TOKEN',
  storageOptions: { // vue-ls options
    namespace: 'pro__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  }
}
export default config
