### ioredis-session
**Warning**: For internal use only!!! Rain-classroom ioredis-session only offers checkSession and dedroySession

```
var app = express()
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  name: 'SESSIONID',          //cookie name
  redis_conf: [],             //集群配置
  secret: ['keyboard cat'],  //加密解密cookie
  redirect: '/login',         //session类型，决定session验证失败时的操作：
                              //  redirect: 'wechat': 由服务器直接发起重定向到python端授权登录
                              //  redirect: '/login': session验证失败， 由服务器重定向到指定路径
                              //  redirect: undefinde:  session验证失败, 返回401
  cookie: {
    secret: [],
    maxAge: '', // cookie有效时长
    expires: '', // cookie失效时间
    path: '/index', // 写cookie所在的路径
    domain: '', // 写cookie所在的域名
    httpOnly: '', // 是否只用于http请求中获取
    overwrite: '', // 是否允许重写
    secure: '', //true：需要https服务
    signed: '' //对要发送的cookie进行加密，密钥为secret
  }
}))
```
