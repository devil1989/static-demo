项目构建原则：一个项目对应一个package.json，不能在多个项目放在同一个package.json里面，否则一旦某个项目要升级，其他项目因为文件的影响就会导致错误；
            所以一个项目原则上是用同一个技术框架，如果技术框架不相同，最好单独切另外一个仓库，这样保证各子项目的技术框架升级的时候，能相互独立



浏览器调试的时候，如何排除f11跳转到框架代码里面：
    1.点击chrome的调试器右上角的机械齿轮
    2.会出现：偏好设置，工作区，实验，忽略列表，设备，节流...等选选个
    3.点击“忽略列表”，设置需要跳过拿一些类型的js；把框架代码的js添加进去
    4.比如我f11的时候经常跳转到vue.esm.js这个文件【跳转的时候鼠标移上去就知道时什么文件了】
      只要在忽略列表内添加vue.esm.js，下次就直接跳过这个文件了



//执行命令
本地开发启动命令 ： npm start
dev环境打包命令：npm run dev（基本不用，如果自己想看打包后的文件结果，可以执行该命令）
生产环境打包命令：npm run prod（cli里面会自动执行这个打包命令）


//qa ，yz ,线上打包的区别：没有区别，都是用prod打包，因为publicPath被设置成了相对地址，所以请求无所谓qa还是yz，所有环境通用；
  ajax请求会自动根据host来获取当前的环境，然后用对应的host地址去请求api，所以前端静态资源，只有dev和prod两套打包
  但是node端就不一样，node端虽然不需要打包，但是执行环境命令是区分qa，yz和线上的；因为给html文件里面的所有链接添加host的时候，需要根据不同的环境添加qa，yz等前缀



//调试命令（需要先进入chrome://inspect/#devices地址，然后在执行下面的命令）
npm run debug ： 调试某个js文件【浏览器下可以查看fs，path等node接口】 
npm run debug-webpack : 调试webpack文件，包括webpack插件的调试，只要把插件放入webpack的plugins，就可以调试webpack插件：



注意事项：
    1.node和webpack的版本要对应，很多插件依赖于webpack，而webpack版本依赖于node版本；而且命令行中执行webpack命令，需要全局安装webpack-cli
    2.外部框架版本改动后，需要在webpack.config.dll.dev.js中添加对应的代码，然后再执行 npm run dll-dev  来打包最新的dll文件，这样在本地开发中才能看到最新的外部框架
        外部框架版本改动后，如果准备上线，首先要在webpack.config.dll.prod.js中添加对应的框架【注意，必须添加运行时框架，不要添加包含编译器的框架，那个太大了】
        再执行npm run prod打包之前，应该执行 npm run dll-prod 这个是打包dll文件用于线上引用，和dev的不同，dev环境下的dll文件是包含编译器的，太大

    3.运行dll的时候，在dev环境，要用到运行时版本，不然有些调试或者template的编译无法执行，会报错
      所以webpack.config.dll.dev.js里面需要添加resolve，给vue设置到包含有编译器的js
      同时webpack.config.dev.js里面也需要设置相同的resolve，这个很关键，否则虽然dll文件里用的是编译版本，但是在执行npm start的时候，运行的是webpack.config.dev.js里面的内容，它没有设置的话，运行的时候还是会因为没有vue的template而报错


//dependencies和devDependencies区别
dependencies：项目依赖。在编码阶段和呈现页面阶段都需要的，也就是说，项目依赖即在开发环境中，又在生产环境中。如js框架vue、页面路由vue-router，各种ui框架antd、element-ui、vant等。
devDependencies: 开发依赖。仅仅在写代码过程中需要使用，比如css预处理器、vue-cli脚手架、eslint之类。
npm install :只安装到node_nodules中但不跟新package.json
npm install -g :全局安装；
npm install --save :插件放在package.json文件的dependencies对象里面
npm install --save-dev :插件放在package.json文件的devDpendencies对象里面
devDependencies下的依赖包，只是我们在本地或开发坏境下运行代码所依赖的，若发到线上，其实就不需要devDependencies下的所有依赖包；(比如各种loader，babel全家桶及各种webpack的插件等)只用于开发环境，不用于生产环境，因此不需要打包；
dependencies是我们线上(生产坏境)下所要依赖的包，比如vue，我们线上时必须要使用的，所以要放在dependencies下；dependencies依赖的包不仅开发环境能使用，生产环境也能使用





//文件结构说明
build：本地打包服务启动相关的js文件/
dist：打包后的文件夹(这个文件一般不需要本地打包，cli会自动在服务器打包，所以这个文件夹不需要上传):这个只是本地打包产生的文件，
      执行webpack-dev-server的时候，把文件放在内存里，如果想看打包后的真实的文件结构，可以执行 npm run dev，就可以看到打包后的文件是啥鸟样了
      本地打包和压缩打包，都放在dist里面
      
mock：mock数据文件夹
src:开发目录
    app：具体的业务目录，里面每一个子文件夹代表一个页面
    common：所有页面的公共js，scss，图片，iconfont等
        pc：pc公共部分
        mc：移动端公共部分

    components：所有页面的公共组件
    libs：公共的js基础函数库
        device.js：设备环境判定
        ie8-hack-less.js:ie8的hack文件，只是hack了ie8常见的一些问题
        ie8-hack.js:ie8hack文件，文件比较大而完整，因为用了babel-polyfill
        react.js:window对象上注入react
        redux.js:window对象上注入redux
        urlMap.js:开发环境相关，local，qa，qa1，yz，prod；webapi相关
        util.js:url处理，cookie处理，date处理等
        validate.js：校验


.babelre：babel设置文件
.gitignore:git提交代码时候的设置文件，哪些文件不需要默认不提交
package.json:工程文件，里面包含了项目启动以来的插件，项目启动命令，项目简介等详细

webpack-assets.json:
    本地打包，一个页面会有一个js和css，格式是bundler-hash值.js/css ,这个静态资源文件需要发送到静态资源服务器；
    但是node端每个页面的js和css都是不带hash值的；所以需要这个文件来做mapping，替换node端的链接





//热替换说明：

//连html都是静态的纯前后端分离
1.如果是纯前端的站点，html文件也是自己用webpack-dev-server来生成，那么开发的时候文件产生变动，可以设置自动刷新html页面，不需要自己手动刷新
这种纯前端站点，连html文件都是静态生成放到cdn服务器上，在html生成的时候，所有和服务端有关的数据，都需要通过ajax来请求，当然一般也只有登录的auth数据，
因为数据都是ajax来获取的，所以相对来说安全性不会特别好，html文件的加载速度监控等各方面的数据，都会有点问题，所以这样的站点，一般都是公司内部的网站管理系统，是B端的站点。


//除了html，其他前后端彻底分离，打包生成前端的静态文件价包含【js,css,图片等静态数据】，这个文件夹如何引用，就无脑交给后端去集成，其实这里就有一个服务端动态数据放在html里面集成的问题，所以
  还是没有彻底分离，其实就是第2中没什么用，还是得用第3种，在服务端下独立前端文件夹，完成前后端联调，后端只用到dist文件夹下的打包好的数据文件
2.如果是C端的站点，那么一般页面都是服务端生成的，服务端还会在页面里添加各种初始数据，包括监控，权限等，这样的站点前后端也是分离的，但因为html生成是后端的，所以修改前端静态开发文件的时候
  是不能让后端html自己刷新的，资源文件其实已经更新了，但是html需要自己手动刷

//混合环境下的独立开发：迁徙的时候，也只要动项目的publicPath【在打包文件种的入口处修改】和统一的ajax的host前缀。
3.混合型，其实还是后端动态生成html，但有时候如果后端服务没做好【不一定是node】，前端开发依赖后端环境，那就很扯淡了，可以在dev环境动态创建静态html文件，文件结构就类似后端的html文件，内容几乎一摸一样
  这样后端没好的时候，前端照样可以进入开发阶段，而且还能实现热替换；如果后端部署完成了，就用后端启动html【如果后端恰好是node，直接用nodemon实现服务端自动刷新，开发更加顺畅】；
  如果后端已经提前部署好了【一般所有公司后端肯定已经部署好了，不然业务怎么运行？】，只要再后端文件夹下开一个前端静态文件夹作为前端项目，前端的所有业务和打包都在这里处理，包括html的生成；
  但是又一个问题，线上的html访问的都是其他文件夹里面后端html页面【这个html是动态生成的,不再自己的前端文件夹里面】，那后端的部署运行，就是后端要做的事情，后端工程师部署一次即可，和前端说页面如何运行起来；下次有新项目的时候，前端自己现在自己文件夹中开始开发，包括调试用mock数据，都不依赖后端，等后端有时间创建html文件了，再去前后端联调，在后端的开发环境中把数据走通；
  不过前端项目的文件结构已经要和后端一起确认好，因为后端服务获取前端静态数据，都是需要配置路径的；后端用到的路径，肯定有一段前缀是指定到前端文件夹的，把它设成publicPath，就完成了前端和后端路径的一致
  这样的情况下，如果后端要迁移，在后端api接口数据结构都不变的情况下【接口的host可以变，但是对应的api的路径不能动】，前端要和后端一起配合，
  前端只要修改统一的ajax的host地址，以及项目的publicPath【在打包文件种的入口处修改】；其他都毫无变化，项目打包，业务，都不需要改动。



