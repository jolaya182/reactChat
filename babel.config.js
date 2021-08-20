let plugins = [];
// if(process.env === "development") plugins.push('react-refresh/babel')
module.exports = {
    presets:[
        ["@babel/preset-env", {debug: false, useBuiltIns: "usage", "corejs": 3.14  }], 
        ["@babel/preset-react", {'runtime':"automatic"}]
    ],
    plugins: plugins
}