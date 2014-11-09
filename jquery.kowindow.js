( function( $, undefined ) {
    var plugname = 'kowindow';
    var ua = navigator.userAgent;
    if(ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1 || ua.indexOf('iPod')  > -1){
        var start = "touchstart";
        var move  = "touchmove";
        var end   = "touchend";
        var fullevent = "touchstart";
    }else{
        var start = "mousedown";
        var move  = "mousemove";
        var end   = "mouseup";
        var fullevent = 'dblclick';
    }
    var Class = function(elem){
        this.elements = elem;
        this.elements.data(plugname, this)
        this._defaultStyle = {
                width           :   '100px'
            ,   height          :   '100px'
            ,   border          :   '2px solid gray'
            ,   borderRadius    :   '0px'
            ,   movable         :   false
            ,   resizeble       :   true
            ,   modal           :   false
            ,   display         :   'block'
            ,   fullscreentoggle:   true
            ,   keepforefront   :   false
            ,   keepcenter      :   false
            ,   innerWindow     :   {
                    content_frame   :   false
                ,   framesource     :   ''
                ,   autoresize      :   false
                ,   border          :   '0'
                ,   sandbox         :   'allow-same-origin allow-top-navigation allow-forms allow-scripts'
            }
            ,   titleBar        :   {
                    visible             :   true
                ,   height              :   '25px'
                ,   width               :   '100%'
                ,   borderRadius        :   '0px'
                ,   caption             :   {
                        text                :   ''
                    ,   borderRadius        :   '10px'
                    ,   fontSize            :   '20px'
                    ,   textIndent          :   '20px'
                    ,   overflowX           :   'hidden'
                    ,   overflowY           :   'hidden'
                    ,   verticalAlign       :   'text-top'
                }
                ,   backgroundImage     :   'url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/Pgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDEgMSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+CiAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkLXVjZ2ctZ2VuZXJhdGVkIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNGYxYTg0IiBzdG9wLW9wYWNpdHk9IjAiLz4KICAgIDxzdG9wIG9mZnNldD0iOCUiIHN0b3AtY29sb3I9IiM2ZmJkZTgiIHN0b3Atb3BhY2l0eT0iMC4wOCIvPgogICAgPHN0b3Agb2Zmc2V0PSIyMSUiIHN0b3AtY29sb3I9IiM2ZmJkZTgiIHN0b3Atb3BhY2l0eT0iMC4yMSIvPgogICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNmZiZGU4IiBzdG9wLW9wYWNpdHk9IjEiLz4KICA8L2xpbmVhckdyYWRpZW50PgogIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9InVybCgjZ3JhZC11Y2dnLWdlbmVyYXRlZCkiIC8+Cjwvc3ZnPg==)'
                ,   close_button    :   true
                ,   close_image     :   'data:image/png;base64,'+
                                        'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAA8uklEQVR42u19CbwlRXnvV33Wu8y9'+
                                        'd3aGRRbZEQRJfIgiiygxLAIqi6iIkoALypK4PFEQRXxxAxFDYsAoiiBGSTSIoqhggGhEUWAG2Rlg'+
                                        'mLlz9+Xcs3TX+2r5qr6q0+feWe4wJO/1/Hq6T5/uvqfr///W+qpawH/DZfeuIhy6sAovX1CBA3vL'+
                                        'eETgv7xF4j8oSwk74AkrpJTL8dx+/KIfj3XhdyVpTmzi5xruj+EVYyDFWtxfg+tq/K6RSXUnu+KJ'+
                                        'mbm1/vxIrQl/mG7AfVNN+I/xma3dNBu9iM2/xfOzKNCPW9wNRwxUYdtKwf56wR9CIDh7SBB/jvsH'+
                                        '4LoPArQnbrfDtUD30ZQwO7SHoDKA7WcLeorbp3HvoQzEA/jV7/DL3+A9HsK/I805wl0z0crgrokZ'+
                                        'vd4zUd/aTbZBywuaAAsKAkHvgtOW9VjQBWGufzhK4q545C8QkNfgkUPw2OL4ofIeULKtdHyQjgih'+
                                        'xJvPGQTboUzKO3H3Z/iDfoTnPIqf3flqbxJPum2kBv86PA3rmunWbsqOywuSANuWC3D2tgvguEVV'+
                                        'EEkg5Wp5CbbxKXjkRDy2lyIEfRfsz3L/WPLpmCMAGFXvCACMCPZzyj9LWIln/wvu3ogX3Z+xe6nt'+
                                        'H6br8O3BSbgfzcULbXlBEeDA3gqcvWIB2vaS/mXC/8IBXN+ObXlGIsT+6hCBTft0aiD90dORtKuT'+
                                        'Qum3RJAhEYw2kI4EmTcNjgDhVqr93+PutXjKdfhxNLM+gzpnTbMF31k/Cb8Yf+GYhxcEAZTE/82L'+
                                        '+uEwtO8JBECiDZfn4oe3JSC6Hej4nztPhMBzMuQtMt7m2H9OhizQADIkggIeQhKkmTkP96elJoH8'+
                                        'Im4fovPV9vGZFnxt/QQ8UGts7abfugToRRt/Fqr6t6KNN0Aabx7baH8h4WMigeMV1soKEOhJJPl8'+
                                        'yx9IdHiygAA5Eh+r/cgptODLiBgW/GCVRIgsBXkznngJ/qr7yHFU2/unGvCVdaMw2Mq2GgZbjQBK'+
                                        '2i/eeQD6C8IDCmJXKeBSBPpNicJaGMAD4En6BVf/wpmLDX0g6f6zDiDEPgB09AHINGQMfDILMQky'+
                                        'vLhFRJDwXQwePiqleMSRCr+/aWQCvjsytVVweN4JoKT+EgT+8H508ATF77IPpeKiBOT7EPVyEgFP'+
                                        '4JMmsGTxkt/BDPAHlPxHdHD+KM4PgAev7jO+L5k2gMAhdGYh1eAborTcZ2ggKa7Eu1yCzzxOhHqi'+
                                        '3oS/XzsGTzZazysezysB/gydu8/vsgT6Sl7q8eHfjNvLkRfbKuAKEfBJIPGiTe0n3ObTvnsqETHA'+
                                        'wC4Z+p0cQIoEAum3+6nk5iDUBkQGrgmUhieT0PIa4VncfABP/y45murvfX1oAn48VnveMHneCPDX'+
                                        '6N2fvW2vBU8TYBk+9tXo3J1AQBeIAFztC3M+kYD7AGC/87ZBzO4EBEgT2maV0n+V8a8glPK2iIAi'+
                                        'APBESNnxlKSf/ILMk8AQA74nQL4bd9fRvX8zOQNfHRyH6UzCll62OAGUyv/izgvhwL6KBVMfPhr3'+
                                        'rsWvliUM9AKEkk/AcyfQgR6eGDsFVjVEDRiLO9fn7LOUsoMP0K7ueTRA2iDKETAShFrAawOpUs/v'+
                                        'xK9vofutb2bwxXUj8NQWNglblAC7dZfg4h0HYM+uIqnqIq6XoZ2/AD8LLvGFQOULEJEJUP9p4AtJ'+
                                        'O/jcQ+QkyFs4snHqL8sC5FSuV8o8PyBU+SnjkdEGxvlLIxIYIuSTALcSCfJZjH7+t7UYMInq4gr0'+
                                        'Cx6qb7lwcYsRQOXur959MfQVE4rZl+LmJgT/0Bj4AHxhwC9w4JPEHojADzSAAV7EcSFEmsCCLzkJ'+
                                        'YnHOXECvUSMiaE2QcRMgmfqPHUFPAmcOgJxDT4ImbTPnK/wMTzsVrxkkMl2zfhzumtwyHU1bhAAK'+
                                        '/H/YbTEsQPCtMO6Jm1sKQuxcYKCH0s+AJ0wTK/Ek9YUkZIu6JtYEmjQ52aBY/UMY38k24Nk29Roh'+
                                        '5IkM0sKpDP0CIkFbdGBJwDUAEaCljmfwGB46GtdV9Deu3UIkmHcCHLCgDJ9Dm9+vwDd/4VCE6XuI'+
                                        '26JiJPVOqPEkwldrC3dSwlbhSCA6agERSn+nXHBbhoeLb6aBdnEcEcDuyzRKDWdW5TM1H9p/GWkG'+
                                        'djuZT4ImnojrMIaJJ+Afu0P/Lfzv+uFJ+Pnk9AuXALsptb+bUfvWUz8a/7upKERXG/gWU+3occlX'+
                                        '/xWTdvAV8MQYpwWSuf2A+AkzGfoA3P6nngRG9VsCWHfdbC0RMu/9Swb0bCRIwbsZar+l/5T0BFBr'+
                                        'SmSQar+Gv+JNSIRbyOT889A43D01f5pg3gigwd81UPsqm/etQiLKxUjqvUB78DVu6gsCv8iBD4kQ'+
                                        'gN/mEELkA0RLEOxH0h+rfS3xtJ96ErRS5xuEYV8+CdI8TUDaINIEpAUaWgvoz2r3Lfg4/5LaJJUi'+
                                        'wT3zRIJ5IcCuCP5Xdl1k1b625ceqH4ySX3K42bXosBPumMarSKAXzEkWdMEJkYSmIFQdkUMYP6FL'+
                                        '/uSpfwgk35Mgc1Iv2b411sZ1zyFBmkGub8BJQMdazJlsMlPQzJwWUAxQYcAb8bQf0vV/v34U/jiz'+
                                        '+dHBZhNAxflXodpXjp/x9sWRiMEPEPxqkeHEtYAGP4nBLxiQiwz4DqYAOKtEEnYWEAn000WZwDgE'+
                                        '5PE/8/odEdIQ8I4kUIl+ugVYQLOwp5AIkJcjYB1HbQRouH2YQUf1GPz6Z+rnTeF3lw+OwDPNzcsT'+
                                        'bDYBrtp1Cbyst0Rtvp8AeWcxEX0lkvAkkv65wC8m/libSYjMQKHdBAhOgIT90CgKkIE7H0t+jgPI'+
                                        'AVcmgIjQzCOBBzRjql5rBRUCAgQ+RMq0AHcIlfSrYsV66kgwhiQ4BL/+YyYFTOIFn3huEB2FTc8Y'+
                                        'bhYB3rm8B87cZoFJ7QrYFh/rHpT8HXDlJpyBr/aFw8/Z/FKhHXxHAsE+MyeQEUEkpAUS5gjm+AHU'+
                                        'UJHtl5HzF0u+IwLZfwV40+8b451qUkU1AbmFI3mmwGQSZa4WUNs6ESKDp/DHv0JK8ay69uGZOlw5'+
                                        'NPr8E2D/nhJ8+cWLKXlTxd/yS8Tn5QYnEUo+c/oIQwe+ArdkQBZ6nyTe7hdDn4D2hfMkk/ykUJLz'+
                                        'aHkZQBfLIRHI288i8B3wkkl9aklgv7PoZFbCM9YBFILfOV3MzYTzB4wPoE1BI6PPcA8+9aF4H12x'+
                                        '/KOJKbh1YtO6kzeJAL3YuN/ZaxmGe4La+aso2WcWNdge5CJX/XRcrcSKkpd0UbKfC3ZbYpqAgLdO'+
                                        'ooh9ARcVMOlP4kck6Yf27J+Tfhv+xRqAS7qTeEYCC775nOrbt+iWIHkuaXYSgCdBK9IEjdSSwBBA'+
                                        'JYyuxsd8N93zKnQKH21svFO4SQS4dKcBeHVflcA/DSX7myT5XPUXnfMnghS+kXQm+aWCJwMHv8Ts'+
                                        'fzGKCPIIMFs+IFD/0BF8n/DJIQCpfZ+204B7g50aErQy7+FnXgv4LCBzFvM0AfhaAh4W1i34RAL0'+
                                        'B07D069X1wy1WvB5dApnNtIf2GgCvLKvAp/eaSHl93fG9r0PpX6Bk/7I6SvykI9UfwSyJgCRoszV'+
                                        'vzcTgjmJ7RlC5lUWRBv4rkmY6hdtrngWrhT+tTjoDOyW3zot0GAkSKXrBiaz0Mrm0ALQ3pXctOnh'+
                                        'hiUBgW/IIMfxkv3x/MeV1rhjchr+bSNNwUYRoAcBvmHPpdTBo4L+X6DUH0JAKwIUItVfYP6ALu4j'+
                                        '8K3UC5L8csEdc0CXmHmIwkSXFyjGEYHRBDKvVzAvAUSuOqIjyANL03yv30k5A5wcwBwSuEog6c2A'+
                                        'czHARATBmANGBNeNzAhgnMGQBOgk3oFPe5jNS8HVw6PwWGPDy883igDvXbEA3rSkh1T/+xDcK0vO'+
                                        'POdLf8FKv3P8ykSAorf7WvLzzYDg5iDwCXLyA3FGEDoTQAYaIJR8Edj61Kv6VqTum975yyOBMiNp'+
                                        'Dgl4jUCWExFwN6VFawC8dARQhEBCvQ8vuUr9jdXNFkYFI/NPgOUIyrf3WEomdnsM/R5ATPoKJKhM'+
                                        '0p3tT3y2z0l/mUl/2ap+Lv2BdmCgO+0RaYk2X4BpAq4EKA/Awz/K+bci9W8NryBpb5mWl600H3xV'+
                                        'tNG0JCENoLaoSSig0M5gaiWfaQEeNQSVRhASJWUmoG6dwjqZgjRDUyD2wl/wrDrvpvEJuLe2Yani'+
                                        'DSbAJ140AId4x+8GlPiTixaTwPljYV9R+F4+L/0G8LnBN58lPrF8ahSlsmT68XvxXnsvB1jUbZxJ'+
                                        'l2JMwp5Cng3k0h9HAKm39TLw9L1kC6byvSaIwFbfqfGAiIjoGQA5NqwJQLkB0gKBH0ChIkB7UGJJ'+
                                        'S0kk6iDiWoAIoPbxuxvwsU9V5w7h3/3s+uH5I8B+vRX4gnL8jPS/CqX/jrLw7U+hX5v3nwgm/REB'+
                                        '0AQEqp/AL/uoQE7WQawrQu85n4HSfv9L49e67x6Y+seLINsdz0NSgnUghe9O9KsbPqKWzKTfaBur'+
                                        'f0YAmeP0CSvxshFpAPV5pgVycAq6jjsTqiefDcmCfsjGR6H29S9C7V+uIRcjSPkGRaNRR5FzUyAk'+
                                        'iyIBhYPkC8ykziQg1+QheKv/UOf/dHIKfj49d9fxBhHgc7ss0YmfREmPEHcjuAeVCt7O52mAIu/s'+
                                        '0U4eAVz0YV850gBlr/rlVAPEYBn6Pn09FJatCH5PNrIexj9+Osi9kYU7L7YmoqD+kF5FUrQkKLCr'+
                                        'pAUewZLYahk6SnobJn04+EGIZ4EXnARaHzdBPj0OPe+6CKrHntbWdtPfuAKmv/ZZF0lSXsDlCWIC'+
                                        'MG0AEAYqmgC2g4jMABHAZArl3djcB6vzpvCPfH54GOpzhIVzEkDZ/ut2X2pGaQjxBpTLmwnPgpX+'+
                                        'Eo/9gTl/lPJ1tr/oJbxsyOCkv+ylX04j+OsrueAHJLgISfDSEpJgGeJdxj9axm3JkgHvJZLgSWWm'+
                                        'AE818DJt4GckQdYwx3ial9l62cjaJV5v0YLXkExPjEDPOz6WCz4nwdS1n7V9/YwATLJdehh8kEJu'+
                                        'C9cCqm+AzIAmgDUHM+R2SPkGvOjf1D2/Nz4Ov6/PPg5xTgJcsG0/HLWwSwOJ0fO9JQEHcOkvkfrv'+
                                        '4ABq9c+l35mBoo8I3D6uCvyR6qzghyR4B8DL+iDZdXv8w2Uj/UgGgWSAxGoDO5hcovRDWkfwaUXw'+
                                        'W7hVJEibzOvn0t8y3j0DXih7X0PJf2Q99Lz1wlnB5ySYvOazGiw/ViAaReSyh/l5K50X0OnhMApw'+
                                        'WkCTQN6LYeGBKcbBI3izLwwNbToBVNz/3T2XmXo9EK/Hj7eUSPqT0P47xy/xzl9Rq3/B1H0xlP6Y'+
                                        'ANiwYriyQeAHJLj4nSBevg0ku++I9+82a7ELwa/gjyqpgjOj9iWC2ZrBdRpBnUArMIlIzJhjKXrN'+
                                        'aSuI9aXqam1YEjSY9KN5kqvWQc+p/3uDwOckGFckaEnn2bf5ATwa4M/JiOI1gDEFM1oDSOsQ6gzh'+
                                        '6/HUW9UYxOtHR2HlLCniWQlwPHraZ23TZz1/8TPE6oiSC/uYrefJnyRM/ohiwmy91QBc4iv2O3Tk'+
                                        '5GMjMHDZzVB40Ys3uFGJBBOfOBOSV+0GhZfsiwpggSFBoQu1QMn4A2T/0xoCP4WAjkNWH8HtGAKN'+
                                        'n1s1/R20WkGsz4HX+wr8P66BnpM+vFHg0zLxqffB2E9uRkUSRgSBGZDtBNBagEUDzYAAjAQtfc5P'+
                                        '8YrXKgKsRBNw/djYphHga7sugW2U1ILcNxHJfSodXw4IIIKwT+cEePZPmeCil3APfpHZ/aIhgXIk'+
                                        's51Q+q/b6EZ1JLjkLCi+7lVQeumf499aoLWAIoDyBSQjgETJz+oIfH0Y0pn1IGdGtDZQJABNgtT1'+
                                        'vzotgKpfOaby3meg540f3CTw1dL8/d0w9MFTYXqy2RYRtGy5Ou8iFtJEstw5jAlQjwhQzzRf9sP/'+
                                        '7lc7X1i/HkazLPf3dCTAzpWi6e41p1yFYL+nZAEuMQeQq36e/qVMLXf2AukvR6YALy6V94UFH71q'+
                                        'kxrWkeBT74HKG06E0gGvdAQwIaG0BJjREp81RiGbGcJ1ELLaOtwO4/Fp/Z12DK2RpeSOnEJf4Z6n'+
                                        'oOfEv4XqMZsGvlpajzwAQ+cfD9ND00G9aV6dgJ5YxvoCmgQuO0ilYmZ1GqBF/oC+7Mt42Tnq8lsm'+
                                        'JuDuWv54w44EOHPZAjhhcbf6w1W0/2sQ7IGyJYDrl8nt/WO5fxWFlayEO/VPoCde+tW2it8/I2Dg'+
                                        'Sz9B1V2ATV0UCSYvfT9UTzoDSi87xGoAYQaAy8w6ftOI8ZghAIKf1p6DbHqtNguyMWVMAU/wTNYh'+
                                        '+9UT0POGCzYLfLXM/Nt1MHbDZ6D25KiWYpeKAJPuDQpIIgJIphnIEdS5ABcJKBIYQiAXRvCpt8XT'+
                                        'Z9TMJF8ZyU8PdyTAP+26FFaUNBAnqz6gEiJaDqTfgF1KfN8/7/zJdQAd4CzurxiTIJAAcroFXXuf'+
                                        'DF2nvmezGlmT4NMfgOop70ZNcLCpGALTmnoACGqBrDGBqh9NQG0tkmANpFNIgvoQEmDSaIFW02X3'+
                                        '5C8eg+5jztts8LOhdTB24UkwMzkE9UeHbYcQT/QwDWC/c0BZpChKaPMDlPRnngBNw56T8FY3KRJ9'+
                                        'HqOBPDOQSwCl/q/YeYkGGq/9PoJ9vAr3SiI/Akgip5BK+3V2zql8rgGY7XfRAX5e1APy4WHoPuws'+
                                        'qB73tnkgwblQPRVJsP8rGAlMPkC2prQTqCQ/m0YCTD+LRFhriIFaQJFEjqPN/+nD0P16Bf5bNu/3'+
                                        'DA9iyPp2SAemYOauJ6FZa/nu4jhTyEhA4SB1bkrmLzRScOVipP6VFqjZ41kmv4/a70RF+lsmJ3PN'+
                                        'QC4BTkLv/61LFyhge4VKxibQVbIJH2cCbKxPBCixCMARgHfzEgEqTP07IpB2wHVxH8g/PAfdh/7V'+
                                        'liOBcraUFqgrPwBNwCSCP/0MkgC1gDYDqAWmkAi3/gm6X/eBeQM/W1aH5q+fgtbojFb3TW7/bZaQ'+
                                        'IoPZCKDkmK5vOifQgm+JYEvKanjJUpUYfLLZhH/KMQO5BPjkDgthv+6y+oPHI6Dfp4SPywEwsIvc'+
                                        '/s9FgGpO7F8pBc6hVJ8X9wP89hnoevW7thAJpMkEoh+Q1tAJnELw1YpaQIeH4+gf3HIfdB95zvyB'+
                                        'v7wO6W9WQzpSs4kgX/bFCRB0GTMCqIVGvJvCEeUDCO0L8Eig1jLbhnUwcTkBL7lZXXrhunUbRoDv'+
                                        '7bEcCmZU7VdRzZ9ZoozfHASgyCAkQNHF+6JSDPsAyPkr+chAqmNdJUj6+0H+ejV0HXLGFiCB0AQw'+
                                        'GkARQPkAT+OKBBgfgtYPfgPdR7x7/sDfBv2I3z6NPsB0YO/bCBCZAF3xr0cDGZgKrGOTCKCIFBOg'+
                                        'lkpbUq7P/Spe8tfqumtQAzzeDItF2giwd1cZNcAi+mNPICY7Gl9O+BCQe/yzEaAUOny5BCD1zwlQ'+
                                        'McRIFgyAvPtJ6HrV6fNMgoN0SliHgioKUPYfwU+HVkPr+3dA1+F/NX/gr0BNc98zAOvR52ixASBK'+
                                        '3aeMABLcsPE0CAOV42q6YWn8Cw0/b6VCO4NhLkB3UbihZXjocbxkF6VIbp+agp9PhSVjbQT4y4Fu'+
                                        'eNcynf3bCb98vGxrNxUBisKX6hUYARKXAOqgAaijhxJAlWKYA1DmwR6TzDkUaA6S3oUYgj0OXa98'+
                                        '2/yR4OS/guJL9jWhoMoBKCdw6Alo3Pjv0HXoGfMH/nZNkPev0eArjy1LZWcN0IEA0hKAipwKwpuA'+
                                        'Vibc6CFFgJoNA2umT8D5GLjshJsnH6zX4dtRVrCNAO9Z3g9H9HepL07DP/ZNV8GVeAIEXb6JH/pV'+
                                        'jAlARSAWVEcAZ//JJ1AEMOfJSugwqmtE9yLIfvkokuC0+SHBpe+HyoknQ7LHLtoEpENPQeP6m6D6'+
                                        'qtPmD/ztm7q/wIBv0suKAOTtE/CtnDCQk0An9aSBiWpdwB6nXuzZNIAJB0FXD4+kaVvnUBsBLtpu'+
                                        'Eezbo6ZghysQ0PdzAnhPn9R+FAbayIAIkcROYCWO/1mWED9LdpybBaUJRBeS4PZHoOvgU+eHBJ96'+
                                        'HxSPOhTE8j6o3/AdqL7y5PkDfwdE4JFBkGjzTTKppbd+tJnvDGoG6WDpQ0KwFcKMAHyGVE0Ae27Q'+
                                        'KRRpgKbxJ67AS85V5uRjg4OzE+DG3Zab9K+AOxH4V5VdIa/VAGxMRq4PINggEJ0HKNhsIHUFcw1A'+
                                        'BDDkkLG5CPaLmgQqLq++4pR5IcH4R98B2brV0P2OD80f+C/C1n8cpWxkGmS95bKJyivjBGg6qWcO'+
                                        'IAHPCcCcwCTwAxgB0BS4TKDTAD5ZhIfvxEtere51zegoPMEcwYAASxGcK3dcah1AMYLAD1DnD4WB'+
                                        'qnfdF+K2l4K5IWCJ+b4tD5DXD2C/k4wYPDLgZEgqiyG77U9QPejkeSFB8967oPKa4+YH/B2x9Z/C'+
                                        'WBtDPdloBdKvagr88AOpPXw38oxVDWfAzIK6eQ4BtBUQ9j55BCDOWQKgaRlBL2KRcge+hT7AKlYk'+
                                        'EhBgLwy/lAlA/FbgBc+WeRW3DQN9ypeIIFgnkD9GpoIXf4gyNwGsIqjNKaSqofizJUFpCWQ/eQhJ'+
                                        'cNJmk2BzFwf+TtjSz6CDNWrUvmTg68+IlK4CslVBsQ9AlUKBD0DvMJBs1rSAALZcHD9QeZjKCNZS'+
                                        'Gkco3SRUuKzA3efiSCAkQLUEH99+kTp4SKIKPxkBiswHoDF+cel3UA9A1cBFXwqmzQDvBo41QUwW'+
                                        'rj14SbkiQXEpZD9ehSR481YjgQN/Z9W04wh+jUk8I0DdRgBgx5xIVikcawAJLEVM09ZaDWCHPyaK'+
                                        'GNjGmXUclQZwBLC5ABpJ1PQJITWs/FezEuCEgR548+Jexba3IojXUeZP12vEPoDwZkB1GfGSMCKF'+
                                        '7hBykQABmUOAEjcDPGSMi0WJBGrFELGImuDWlVuFBAb80yFTEfbghAU/dWpfst5EHQJm5PhJ5+TF'+
                                        'EQCfNSQmAJ86TwipZ2JpufGDwpWE1Vh9YBAJSPlWvNe3Hms04GssFGwjwJsW6+lcP4wgXlbmBIjK'+
                                        'v/yET+FEEEUR+gd+QEhMgKgwlJxF9p2ICOAGi7iRQ0V0NJEEP35+SUDgy10FyPUI/thMqO61AWaf'+
                                        'lQPI7X804MOVhDFi0OBRUxwaE8AAR4RqMAKQH0BFo5QSxqjhw3ij//M4EuDa2QjwxkW9avcLxYI4'+
                                        'zxEgoQygYOEemQE2+oeHiSxN7AaAkCS3EYCZiVIOAYI18fMIOBIstiTY8j6BA383VMRDkwDjtUDS'+
                                        'Xf0grydQ9h/aCeCjAMkmjPIVw9JOP0cwFUU490XmogAD9IztB6hT2TiLBFADfQEvuuDx+iwEON4S'+
                                        'AA/+M0r76WWucZNoAIgItQDXCrOaAU2AJJT2WNI5UYoh+G5EMR9BXFA+wSJ0DFfNS3QwK/gXK8kv'+
                                        'ghyNwOelY82QAKT++ZRwfMRPmoXqvyWp18/OaGrfh2AGPktbpOudyDYCZH4IecMT4J/xojM2iAC4'+
                                        'fA/BPoHUf5kRgMr8+Lx/fOYPDTqYyb5Uh5IrDStxaY+cPLcW/fgBayr80PH2QaLxkPGktMhEB/OQ'+
                                        'J+gI/m4Eft2reQZ4CH5LS7+P7yVz+ngUIN14wSbwolBPAEoDa/tvJ9HOI0CdzSNQZ6EgmpPv4elv'+
                                        'nJMAJyzUTuCtCPZRjgCCxgBaMwDhPE2FyAwUnJ/gzYAoeg9egxcPDCl5coQ2PwQ9d0Ip55Wq8xdq'+
                                        'TdD1yrdA9Q1vnz/wP/Z2kHuWQY6hzZ+oe4l3g0XYGIJmyx13+f/IAQzHBvgIQBMgYy+sUj8AnUAt'+
                                        'XKDa1FSJzkkAqmt1ySB5K7bQ69XQ8WtH/ZxCAQHeYAmAiy4BL6sysCQ0Aw5UrgEo9odoDidWOezH'+
                                        'BxbdfACilKcF/ABRPeaPQr9CCHw8oaTg8wmPFSC97lfQ/w+3QnGn3TabABMXnQXN534LsH0/gJqv'+
                                        'lw8Za/GycRpPaD83U2enM9b5oztzMj/su33IePiyCqXwzTS60r0/oc0HSL36r6ftJgC/+hlec6SK'+
                                        'AjoS4DhFgAE1/BZ+jjgcVlGxf+QHdJL4JHYGo6RQwn0BMgPc9hfzCEDnkeQXouoTLv32j6hRPXc+'+
                                        'Ad1/ed4ml263aQCVNv7IaZAmQyC6SiEB+EiiiACB9EeTRMQOIA0Xd/Y/NwSUNiEkXGEIzSRGo4Ro'+
                                        'cIifSsYR4Od41RFzEuD4Aa0BbsM2P9JpANclHBEA/CRd/Hgw1zP4rKCgGgE2K0jg6buJo1jSp5B4'+
                                        'M1AoeKnnM4fZbjI1IYP8z9XQc+z5m13AmUuCDyMJmmtNZVMwSwgbSmYJ4OYJyuy8gRlEYwC8Wcii'+
                                        'Y5JlAcGFgNKOznYTc9kxAowAXAO0EUDehpe9blYTcGx/D5oB7QP8ANv4mIrGSESRgJkbpuBskl8p'+
                                        '9OMEcKGiPV9QB1Ex1gRJqAXY94YEpPIL7bOF4r4G/7fPQM/xfzPv4Ack+NBbdAGJ/s1uehg2e4jd'+
                                        'Os9fsvn/KNcf9f+3E0C6MYFgAU/yCMAGi7ZNGpHRvAFABPgBXnbcY7M5gcdYAuByA7b3yTp7i3/N'+
                                        'aW3m3LW/6MGCDSJyEFnGUNAsYUko8TRRFJs2LvT6PfDCdDMGJFAzfahC0p43bt6gjQ0mwQeRBKOr'+
                                        'NZn9JFI0wtjMMxBPBMV7+GLHL43sv08AecB1+Ad+dnUaI9C0g0RmrLRTCFiPMoFIyBvQmpz6+FwE'+
                                        'OK5fE+BqbO+zKtYBrBREoAG4zafuSa4F2s2ALRdPvNMYgMsni+JzBbKJorjTJ2jUSZKY7tKVa6Hn'+
                                        'zR+aN5u/QST421MhHXzCpuT40PL8KWPTyPmLRwHRseCllZLif+nnvzTDtPVCxaVs1rA2AjQ8Aa7G'+
                                        'G7x7dgL09cCxRgN8Etv6wkpiO+2YFnCVv9CuAcyPZRNCcgKwimHtD7iyIg92OwmisC+eHk6FS2qI'+
                                        '9ikfed7AD0jwN0iCZx81aNl5BdzYvswXbcRTxfKev7YJowh8C48GHaR7iZawFUFqoSgiSPykLA+Q'+
                                        '+eJQJMAn8WYfVyagY1/A0UiAY/q1D/BebN8vGxNg/IAK0wA0+CPv3X5k84O3gUW5AfIdHAm4xx+E'+
                                        'eZx15PhZcqhGUpMznLZxQ7TnnQQXnALpU3/SKGbMoXOvk8lC8HnSh3v/Tvoln9damVMm/eAJIMFP'+
                                        'JBnNHcicQNYXIOV78fKvzEqA/aoVOHtJv9o9Dm32vxIBTI0mDQxhYR14kPm7fQsdCMAjA/eyD5Jm'+
                                        'PmE0efw81ucJH9UGz0xAz9s3bHKGLU6C80+B1uOrvFTzV8iQnSewc14coWcLiwkgme0nAtjwT+cA'+
                                        'gJI8ws8lnPq5g4gElAjCy47FS3541/Q0/GhyMp8Au5VLcO6yhQrMfVDd3F+24PNowE0IGUm96af2'+
                                        'fdYxCZLYFAAwEohcld/+BpHEgL9uCnrO+Phmg68yfM3f3gmV1544LySoP7oqKOzkEz4E0h+ZhRbE'+
                                        '4IPJ/lnwwfpc6um1Y8hMCY0QzptDMKoH2AcveXDWeoDtsPE/snyxHhGM/00i8AXqC6hQOFhg5eCO'+
                                        'mWG9mithTry6JwLwqqHAf6CuxGgV3O6rUb4jNeg58+J5AV8nd9CR63kHapLjNi9trEgwhiSoPbrS'+
                                        'Ol08pvdOn58nGIJIgat+cv4S6/yR98/BSqX38F0YSARwnyW9gyjFa3vw3nU1b9DvZvwcgiJ+kC9t'+
                                        't8zOBwR/Qudvt9gMlKOaAGHvomP8iARtWsCe50P4PBKIUOLpDSIK/Mkm9Jz1ifkB/6K3g1TFHNWS'+
                                        'jiK6j3zfvJFg8uGVGgQJ3P7LYB5g7hNICGcINa/dYaofjAaQ4N+CSIUgbph4BkEyiCeBcINOCuyh'+
                                        'rlOjgzoWharlg0sXwfYqXw9wUykRb6LyvdAM2OwehPMyc1NAn/NeDhWQgN4Smvjvfbq34ONGfLqe'+
                                        'd39y3sDPdrAFnNMNgB0XAgxNzxsJRpEE438yJHDgg3/pZDgHQH7oRwTQJLDpYFqkjS6athTM2f84'+
                                        'E5jRYFN5E55+kmLOpevXBzOKtxHgXYv6Yb+uqtr9EOLwmYpNBauEUMX1CwiWD4DgZc6BKYB2EviE'+
                                        'EXsHFGW7mFYRPMePD9ZzzqXzCD66XY8NA0zMGCRU6754sa7smU8SjD60UnfQxE4f1wzBi6nBSr8L'+
                                        '+0igSPrN/2YUsfBpYE4AlhVk1UAfwgv/bgbt0qXr5xgYctSCHvgLXPGLQ1Ht/qJCBbzMDygX2s0A'+
                                        'EcD5BNAeKQQkAH+97+uOTIJVDT3nfnr+wN8e1d/DQx58ad8fpP7e7ksBJhvQ/dp5IsF5p8AQkYDZ'+
                                        '/nhGcGP3vYLnYbWAMPYHoHEFfmBoIyaAjQbIAcR7H4q3uUP1A3xtNHy9TBsBXlwuw3uXDKgvlBoY'+
                                        'QbCr3AcgjUADRdxwpZgEwICchQSFiAQ61qVUMn7Ze95l8wf+dgj+Q+tAqmIOPmU8bZWjtddy3bE+'+
                                        'XyQYQRKsX7VSF2vmTQdLQ8DJu49tP5/tWusGB77xA+iFUnFvIPUDqOkC8A4L8boZHQFE08e2EaCK'+
                                        'f/DSbZaCDTlvR6APr0Y+AEUGfGygiG8oWGcR5PsEdDx2EtX3JTUV+fnzCL4apYvOHozOQNvr4/m+'+
                                        'epaXrNCtOp8kWLdypa7X5wmfUPWbxQiOtFIf2n59Pz2mQLCXSPj4P6gDsP4AHr4dL3uN+hvfQulf'+
                                        'Fc0ZKPJ+9HlLFsF2Je0IfhjV9GXVgnCOYNH6An6+QOGdt2gRjAQmj83zBaKtH4EI0oU37r/gM/MH'+
                                        '/jZmbj8Yq0Wvj4sJYMfi4Q8R+24LAhtxPknwnCJBK5wXWDIC8LF/vD29B6AiCeHfH5Cj/lXa171Z'+
                                        'RBMOtP1Xd7h0cLDtlTK5BDi2bwG8ukePEN4Hf8j9XYhK1Y7apomhaMxAKfEEyLsZkYCHiLzfQETm'+
                                        'oBdZtnA+wV9eB/n7Z0zpdtvLow0R8t4pLfGhCi/dFhLlgM4bCU6GNQ+ugulWGPcTEN7us4MOL2md'+
                                        'Ry/9zQzakj7NKB+A1+yDXz34XKsFXx5un0I+lwB7Vypw+sJ+3QuFyughNAG7q9eAVikMFL6jjrQA'+
                                        '9wX8gFbpnBgHfh4ZbP9AT0XAsvdeCF2nnD0/4C9D8O9dDXK0FjhR7jf6XdYBQ/tSq6zC/iugiA06'+
                                        'PyQYhMG/PhqefvwZDSIXRhdOQ/SSC7evSGOlX7JXyPCMnw0NjTbQ60N4+Z7K0by7NgP/PjGxYQRQ'+
                                        'y8XLlkC3yUN+qlSAj6rXfytN4B1AGUwYUbTSzH6v/QvmKeLQMN5XDt82L94RFl93BzqBhc0GP0Xw'+
                                        '0/9arQdqRrjn7xPowCwEGE1QRE1QlvNDgpkffAue/LuPwNhUyw76lMFLzogMZKGsL5Y7OZR7l2Bm'+
                                        'TAOpfzUXsRoehud+Ci/5mNI2Vw4Nw3NpuuEEeDOagQO7q+qEvdApe6BLjc4mLWCni1EaoiByfAHh'+
                                        'zSvYOjbXtcnzA/TguFa6i7DD646Bvgu/Mi/gN39tJT9+Ssk30oHPCSGjffVjy/vPDwlaDz8Az7z3'+
                                        'WFg3VPdOJ7BQWh8ItYN+NjDjCvRs4Q54O7+A9O8XrNsZQ2umg2FvPLRqqJXC54by3yDSkQB7V8rw'+
                                        '1oF+0+0uxd3oAxzUrbRAUbgCESP5MhwSZnPWPq/NmtZ2aBDjuYNYXViFHQ56JfRfet1mgd9aOgP1'+
                                        '33jwA+xl/rUybyujaxTxD9gWKptJgubv7oI1nzgDBp+e1DfnoTP9L7lu4iGj9Mmdpq0hoNG/TZv5'+
                                        '0xNEtJT9l/fg3V6hyHHn1DTcMpn/Ojkx24+9UJkB89KFMxDsazUBSggWqmtDAqk1gevyBeny+0QC'+
                                        'X9smWajozQWZgFJPCXbYbTEsuug7UNhx100Cv4ng1/7zKchGTWdH7JhagTMaKocBcx1T5qCCmkAl'+
                                        'SDaVBBOXnQODD/4SxlaujwBgjRboJz5JtCkBM36AcBNEOPBpqljV+5PJd+KlX1ME+NLQCKxp5b9l'+
                                        'fFYC/OWCXji4q1vFpV34d5/qLoklXSXjC1SKxhSUlS+gIwHpS8RUNsvemmLdEIGQBFob4MXLX7ED'+
                                        'DKS90HfR16GwfLuNAr+B4E/e/RRK/kzQnvSQUnR+WCEhz0cMnXA6pkmwHZJg46OD6a9/EaZ+fyMM'+
                                        'rloPzfXTIfgOe+lMKB3jL4tI1ahgSX0BHvyGBd7MGCrX4y1ehIdrTzea8KXhzi+XnpUAA+gFX7B4'+
                                        'MXn3n0KgP9qtCKBncTOmgJJDvnPH1q9LCEwB5VlcsRMRwZoMtZb7KrDd4TtB97oE+i7+xpwkIPDr'+
                                        'S2Zg4h6U/JEZ91BxXiIgQ/zgs7ZC+yKxQaoHbJwmUOBP33cjjI3WofbAOu4lM6eTfBJhnedw1tCW'+
                                        'Bl+4Gcaox69hvX49P0BTf3cp3uVCRZrvjI7Db2c6vzZmzkd/Z38/7Iz+AD7zMjz9CQwJuwwJDPi+'+
                                        'm5jPGGIrWG3WC9oSH6Hto55uBVp5AElw2E7Qs3Z2EhD4Mwj+6F1G7XPg48xkbqIq57Mjh8g/x2Kl'+
                                        '2V7dQHNA4E9ONqH2x7XmfYUEvowdUsGiEfMGVJoupmU9fVL7Tf+aGOP5m20Nb7ITtve6KfzvssGh'+
                                        'Wd8nPCcBdiqV4J0DA/alUXA54v4BHRKSFigKWzRqfAJ6faxz8Cj1yerl/O/hRPBukCLB9ooEHTQB'+
                                        'gV9bPAPDCL6afpUD3xZWWQbwh401QHiu3XrftY0AwpJgLp9AgV+z4M/cv1ZLQhBmun2TPMns5A/a'+
                                        'DKhZQMCrfercaUY1f3U8WLcmoJlmV+Bl56rCkx9PTsNtk7O/S3iDlN95S5bAokQVZcA2+PseqRSh'+
                                        'p0oRQVG4fgI9m2iB1XSw1KbqxEhTXw/vbZwMGl/Y1i73V2CHw5EEgwn0nnkJFA84WF/U+v1dMHnt'+
                                        'JTCztAmDdyL45O2zcMppFu5vRA/dpily+jNCD73DQiRQGmGf46HrpLMh6V8I2dgw1K67HGYevw2m'+
                                        'JxsOfJck41lH2wqSfpca5WQ/K6mnSaR1/37KXidPg0CxQZXnj9I/hfjsmkmJIb+ES9cP6xdHbTYB'+
                                        '9u/qghMXLNC2HZdPopRfqIA32UHbTVwUvnA0rh0UngQZTZKgNEIa+7shERQJtjtyF+idRvU+khq6'+
                                        'LCxBbUEVBm9/TM+6zWPo3IQKdzY7gB1oj7brczq6+A+VhgTl/VZA9UUDIJ4cQa2HLqKog9xxAGqP'+
                                        'DkH9wXVuys7c7KOVdhNwCSv5SlCEq/2nvv9mRACK+43nb2y/auP/ROm/YWIS5lo22P1598KFsK2a'+
                                        'jUNAr1TlYkWxomqjAZ0cKpqiEdIClBwqFkxpc2ILHVz5kyVCasupXSaOqV3dP1AtwoLdF0P39n36'+
                                        'x9aeHofph4f1u3xcTiEC0nVPR6YlSLfag23HxexagX8Ij2H4u7gHShjKit6KfstI80+DkA5Pu7c/'+
                                        'tSWabEeIZH+IiKEkP3PgSzPjV+q9/iZ1AFnwcfsc3mY3/GpyCo9/bnAYhnMyf5tMAOULvGug33rt'+
                                        '4m24+QZpAXIGK5Qq1ppAmME/KklUsFnCRJDP67vhM+mmTlGjac3cuNKVP1OVkYsWKHtmweWJpSQX'+
                                        'VJEr8XRuAu3EcOfPog1mbTyXDw+BD15rL7ydd5lT8DWDNAVcy6r9hh0C1ky57ZdOA2A7no6XfUO1'+
                                        '5y0T0/Djidlt/0YTQC06IiiXqWj0dgT68AoPByMSuBdLutrOJHivc2Zbx4U6mR1ckdkZMnGHTAeF'+
                                        'lUK0SyoNmmyX5vAYaYYkuk+Sc98wSulgDjqEmrRIPqFP4v+AFCzut3qRhoRnmQc/ZVU9bupXpvpJ'+
                                        'A+D2F6hkD1fEmcKTL143u+e/yQRQeYHzbV4AG1el6+5D4LsrRXAkKBWoXsA6hNYs6M4jpQnADAoR'+
                                        'CTWCHQdvQyI3ONJOqmA6RcwXunTL5hjUyYnNm5OkJyKfJLGE83o7Ikky2zVRhJEXNXDVI+gPCA46'+
                                        'MNB5zyMrEMm8k8ylv8kJkBHo5P3Labx0f7zsYXX+N4fH4de12V8Xu8kEUMvh3d1wRE8PlSm/H739'+
                                        'K8o8M2jBL9v8gBnxJVipvzDp4sRXu/DGITLQBAgkHdKCLukDJRXAmAVPinx1Hku7r1ISXgN0ONeF'+
                                        'kQ5P86UZq+clXIhQ6gVpgSDJY5/Dgg8B+DSPkLH7aerH/zdi6Td2X2mHc/EmV6hrVyHwV64fg41Z'+
                                        'NpoAankPOoQrSsohFNj28kco2UdVGAlI+kssPOQE4NPGuN5DLhk+Tag3DGsXQrnWJPDtZ2MqvA8h'+
                                        'qLsVTHKN90bmE4LIIIJtQqDSAE0GvuBMizoUfK+oB9xMAG3Bz0ITqL1+VAGtIOaXzPP34OP+bXjb'+
                                        'o5RynMTjn35uCB2/2cO+eSHANhgNvHfhQmqM5fibf4cSv8KHg4kf+W21QZH1IBYsCYodSNCmi8Fq'+
                                        'BX4Oc8WFy8ywnILvdmCza3JzHNYlclJwSQ9MAiWTmJMIMqcRLeLSqDCb7MmYFotUv3WG9RBxmks4'+
                                        'la7u370iTgOfaQ1Qa8EaNBcvw7/9nLrPjSOT8POJadjYZZMIoJZXdHXpziLrZb8aD/0UwS8RCdzs'+
                                        '4s4kMC1QoJdOkjnwDczQtK46tGmE2K4KZ3/pSuElNuCTn2KNSzs3GwknAIT7EGxZyEqgB8F9WBNB'+
                                        'GUAigRsT4LSAnUHM2n4f8pHqN6vK9SMBmo/PNF+7tpneOYkXPIXMuGMy/82gW4wAajm1v0+Xj2l/'+
                                        'QMr34PaqcpGZAl43oItIBJsXgt4vbI5zEjjp4nEdA9798CCs4vwwqNr3HjippuHVbeoeOkQCLPIA'+
                                        'Mi3uuBNtZoIgkHJXbyiZ+gfj4JLX72YRoTmE7GgePuRLg2/TvUoD3D5aO3/lTOOqYVQTa5ppNp5l'+
                                        'bTUszwsBVAm5MgUL1XRupvUvx0b9QJmKRjgJWFhoTIC0+zQFLZWYe5PgtlznEjIgmO3139NEisC+'+
                                        'ItvtVX7o+OXmAtwqXfJfAy+9X2GamwX7zMEDZ+8t+AB+7h/p92mSKBo6bicaYa+GDe3+PeMz/3j5'+
                                        '2tEL8HZZwqYUhHC7wUTYLAKoRfkD7xoYgC4T4yf4MN9FIE9wWqAogpCQhvyRBnDjDDkRSBNYEyAY'+
                                        '+JQupS+ccrAo8vQvHQ8lW7CaRD8Gn+7qVxE6kLQfFQg4gnCJB3DRCjcDHnzeOSadCVBqPyWvP2Xg'+
                                        'WwKsnGr85NJnRt5Wl7JhwebrJhFhswmgFmUGTu3vtzZUVjIpfoggm2nmisJlBs3ML1YTWHOQ2K2b'+
                                        'VDJhM4kkzI5zTUBeOJGDiJBY4ER8nbmGZxRnjfv5Z676eaOx6INIIAMNEIaw9PavzIayNIVMloaz'+
                                        'iLo3g1vgG1byV00177nkmeG31TKpUnxptMYkoH2+bjkCqOWAatV0GGkplD3YPLcW1DuHIhIUmTlw'+
                                        'bx9PTDTgMoYK/IKvNKZBJN7OE8BGS/A43ewKl2hqA9mGdEGs787xSSVv9+13kpsC3oPpTYBkah8C'+
                                        '8KkoxiSzYuePppDTJV6k+nWyB+0+On2PTDfv+/jq4XdMZnIc7IwyHVYCPmXAczJsOQIQCd7Y10cN'+
                                        '3osP968o1UcoMxCSQATRAJkCevtYgYWKVGnkgOPl58xXEJwU9gSedqawjod6nWw/QLs20MckMxWS'+
                                        'a4VwcInTApkPDBz44DOdwcuiVLEH7rh434Z8D042f3/x6uFzEHyV4WkAFQf5bRYdI/BjTUAJgoAI'+
                                        '80oAtRyLBDioWjU3F7KK5kD5BEdTd3GROYaFRAR5AffSCUsOMxWdP56QNohidWjbD+N3+p7PtBWk'+
                                        'jgMieAeTO3suryB8v0RYZsydPggI4Z0/ydLcfqrYzFb4tGx5F6n9+ybq/3XR6pGPotqfsAArAjTt'+
                                        'SqB30gixf5BLgnkngFoOQJ/gRK0JdCMX8LmuQhDPKpFTyHoLKStIPYalRFhzIMM5CRMfJfARRUnC'+
                                        'JDfWBnEiB7gmgcgMMLBF6AAGBAAv9bwRQ/UPQfjnByCH6t+9IIJi/5YnwE+Ha7d//tmxLzWkrEXA'+
                                        'N9lnrglIG3BCzEmCLUIATQLlE/T1uUbGhvhbbNjLEPwCmYOiJUIwI4ytIfAvn5IO/HBuIeE0ggfW'+
                                        '7CTWe0s4GSDSAhx8nmqITAIE+zKMAsBHBbzgNcz48RnA2OSQBH5KnT4OfHndc5M3X7tu4rt4l7oF'+
                                        'ux4BzwnRgnZNMJs5CHyCLUYAIsHRvb1QTYxdxmZ4Pf7JbyL4iyhHQJnCOCwk0+BeQUfzCDgfISQD'+
                                        'JZGcZiAwA8nP0QYQ+QkQjssPSSDbXCkyBR7/yBSADPL9rsuXnD+V97fFHqONrHbZU6Pf+uX4zH8x'+
                                        '4GltsJVrAu4X5JEgL1x06xYlgFpUnkDVEXQVjKLF0Gdn/BXXVwviIB0aFrkm4Oliei+BP+4moOY+'+
                                        'ge1ZDOYrZEkfb//9SGTBSeIIIduk3uoPuycDaclNBEXOYKz+3QSRUrpqKAO+VM7emo8/OXrj6nrr'+
                                        'Wbx8Jgf8mAhEgjqEWiD2CVowS2SwxQmgFpUxPH1gAFYgGWoyS9alrUqPKFy4olT8IAJdJN+gGEcI'+
                                        'bBIKRwThCeC1ApuNLOHpXu4vxD2BLB/QIQdAwDpnMs4J2O+oZ88pACmZ9w+R3Zf23UGGAKj25Tef'+
                                        'm7r36jXjv8SIb8qCTwSIiUDrXOYgJsDW0wB8OQzNwU7FYvJgfSZZWW8UkRAvRz/hK/2lZJ9i4klg'+
                                        'uo+jGgICvSDcGEQ3JC2JSNBGBAhMAx+dnBsOCsjRBj5HoI8xmw+QE/uD1wAU71P5m5J6RYTHpppj'+
                                        'n3hy7I4/TDVWM+D5yknQiPbzCEDRQewHZBDmCbYOAdTSJXSKJmlKWcRfWyoLUX1NT885B/d0n49m'+
                                        'oMe8O4qRgEyB8wnY9PNJODN5IkT0Agsv8dxX8HMZilArQLs54HkARwYZagg3mJMB76cfki7US20l'+
                                        '9FQrS695dmLV19dO3t+QMM2A7rTmaYHYF5iNAHG2cOsRAPwsMWrsSAnMjHHlZYXCDkct6P3IntXK'+
                                        'CUiEpFRk5WRMIzjnz0UJ/HMItiMBPx4RIpingAAW3hkUFu02+x/n1QLwrSbIKNdvgEe1L28dqj13'+
                                        '+dPjD6xppKPgbXsn0GsMcC79nbTAhuQFnn8fIIcAwhKgaEmg1jKulZ1KpX1f29t77i7V0mFIBFEs'+
                                        'sI6kggiSR2TzC0wD0LySwcxjESnieYkCMwGR80igq8+uuSL0WfZPZrzAkzJ+Uv5qtD585dPjjzw4'+
                                        '3RyOQJxN+jkB8iKCDfEBYhMAW5sA1K6JJUBMApVGrOxcKr301T0979yrWj5U5Q6KBWCaQHhfgJmC'+
                                        'YLaxhM1OmkeEJNQGfB6jsJo4NAf0AK7Ll7bc67ckUBJ/+/DM8DVrJp7645QGnrJ5MQFq0Nn+x5I/'+
                                        'A+1OYAvCxFCcJqZtWzJoaxCAk4C0QNGCr0hQsSRQa/fSQmHng3u6Tjywq+vInqLoCzRBgV5MyeoJ'+
                                        '2vyC9lnIqBC00HY8jBIS9mNdHoCOMfBJ3ZP6H2tmrZsHpwe/vW5qzdP1dJIBRIDFEj2XAxiHgvxe'+
                                        '/N6dVH+uA0jPtrUW7gvEJKgyIvTg2lsSYuE+lfKrDuyuHop+wh5lDB9J+nk9AQ8ZY+cw1xxA5DQK'+
                                        'P78B7x9wGsBVIofpXyXtd43NTP5wfW397aO1QXTuSCLjFC6XZPLsO0l9DH4nx4+nguMk0Kw9g1uT'+
                                        'AJ1I4PwBu3ZZEqh1Aa4DGEnstHe18mcv6arssVe1sm1PQZS5b0C9is5RTPJUv8jVAHw2M1dMKrkJ'+
                                        'MKCrYxMtmd0zPjN9x+jMxB1jMyPjqe6rp8xcE9rBjwHNk/Q8Zy8Gn6+x3af+gE7FIlu2N3AzSUCR'+
                                        'Aa0V8H5Bt13VS436cF2E63J8gBU7lIo771opb7dLpbR450qpd3GpUCrod0uFkl+wvYsJSyZxH8CR'+
                                        'BNg8/WAnvMDtUDNLH5hqNO6fatTvnWxMrZxuTmYhYByQWFpjMDuFd3Hal9ZW9DfyJD+vEyhW/cHy'+
                                        'QiAAkYD8gtgxJCKQSeAaQZFBveNmsV2X4LqwJxELV5SKC7ctFXuXlApdS4uF8kAxKS4qFgq9hSRB'+
                                        'jSHKQndJ0yAeqSdgQp0+jap8NE2zcZTutc1Wa20jbT1Rb9WfnGnVR9OMgxODnqfyOfhNaLfleffj'+
                                        'zl2jw3251HcCP5b6LV8QspkL74shbRBHCLQSEdRKmoEI0WdJ0WfXXvs9OZZlRrICawMuMdyO8kbP'+
                                        '633jn/m5MZBzrZ1se97fjoGPHb1Y8mdt9BfawsNEToSYDHmagROjmrMl5zKPBDzI505T3KicJDEB'+
                                        'YsA6AZsH8mxE2xjgN6gWkDf2C3XhRIgdRSIDjxxIO1TYWmbbMju3BCEBCtHfitslJgX1rsVp1xi4'+
                                        '2aS4BfmSHRd6cLUex/abDDxv5Bf6wk0D1woxIfJ8Bx5VxMf49XTfmAB5qT9q4Dz7m5eHj/djcPO2'+
                                        'cQIng87SnkW/a6Mb97/T4lP0HrBCzsqlu9OW7yfQrgHiBGBMgjzzQDF3p2TMhhzLcu43l2O30cDz'+
                                        'Bv3vunAyxKYi3s52LAa+EwE6EYGDlOcrxIB2kubZBnrkqfdNBj1uxP8JSwxYHjHygI4lPg/8ti4A'+
                                        'tuSBExdgZh2OzyXZWwTwvIb7n7hw0DqRYzbA8yS/05IH0lyAxna70z2et4b6f2ERG7Cd6xy+yA6f'+
                                        'N3W7VRvl/y9mER3251rkRh5/wSz/Fwj7iCcfEX8+AAAAAElFTkSuQmCC'
                ,   maximum_button  :   true
                ,   maximum_image   :   'data:image/png;base64,'+
                                        'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAABBPklEQVR42u19B5wkVbX+qeqcZnpy'+
                                        '3hxYloUlI2FBkagISBQWQfJDRQSeRCWpT0H0B6ggikoGRQSJElZy3Jzzzuzu5NwznUP9z7m3bvXt'+
                                        'muqZnrAsvPe/v63tnurqrqp7vvOdcM+9pcD/b/+nm7K7L+D/t93b/k8A4O3WlFsDCOLb2owGpbiV'+
                                        'pQE8mgY+3O/RO0JTFOhVFUjZ6BWgF/e14742fI0eUW1P7e772BXtfx0ANveng61RbW48Dfsl0tos'+
                                        'lNqcZAampjJQjjfrQYE6NP3G6RWFzd5nNAUyuEfqEMQJxBAIg04b7LArsMmhKuudKqwJOpUlxU5o'+
                                        'mRKwxXf3/Y63feEBkE5nfG0xba/2qPbVtigchkLfN5KGKhScgtoMYiNBk0RJ6LSB/t6qQxT9OwIk'+
                                        'aTpW49+nza5CzGeHDV678km9T3mzyq2863eqLbu7L8bSvpAA6OjudQ2o3oM7ErZTm8PaMZGUNpf2'+
                                        'u1DKNpQ8aisTWgq3NEkMJYq7waFq4MBj6HO7BA7OALgBHc+/m8BXZA5d6Bo7zo7/McbADRmFbQk8'+
                                        'wK0qfUEXvIdgeD6oRV6pLS1q3t19VGj7QgFg3bbmyR2K/6z2tPusKFK8gpfvtpFgOX2T0JD6mdCQ'+
                                        'qsHrUMDvwFeUtktlmsuAMNKNC5bI6ECIISIGkwBhRFQsxYFCv+8U56bj0vz8uL87aEu9Ug2Dj/i0'+
                                        '6H9mTp38ufYdvhAAWN7Yvl8rFF3WnbSfngKtlITpIi0HroHRFNdGJwojiB+UuAAFj8ZevzsmUC37'+
                                        'fjSdoyjZTiJmiOF5+hMa9MY1BghqHqQFF4FB4eCIZxR2Pr8dPq2yRR4sSfX/ffbUSf27ux/z3ePn'+
                                        'ti3b2nZAi1J0dVfScRp2rdODgieKJy0nrYzp2k7CrsQPS1H4Tl3FNW10wi64w3SzQWAYSGrQFdOg'+
                                        'J55h5saBH3rsgKzEzUyczAg6l367trFaidxbnOx9eM8ZUwd3d7/m3M/uvgCrtnzz9qkttvKbOpP2'+
                                        'hShGl9fGBRpNcwomracOL3KoUOfjgid6z+wioedrqt6DYTQPbdEMdCA9kM9BvgiZBy+9UlyJFx/X'+
                                        'VPDbMquneTN37FPl+dvu7mPRPlcAWLF+k6PHUXZFc8p3IypXpdemseAcnTyIp7iNJVvrQfVqCNig'+
                                        'yq3uFsGbm3AkQ3jROwYzyApp3Ecg4L4H80Fs3KkkVqh2w7MzfelbppV5V+/uPv/cAOCjDTuP3GEr'+
                                        '/2lfUjncg946CZZse1QXfAqlTIKu8qowpUhlnZrJ7F7BmxsBga4HQ1LYNpBmoKWow0E+i8pNFUUS'+
                                        'dE+KogzM8mfunu6J311eEtxtZmG3A+CT5as9vd7a21q0wLWQSSseG9l4dLCSuuCRPpMoeaeqwtRi'+
                                        'G9QiAERs/nls1KFk/wdRyFtCaehGs2DXQ0iKGMhH8Ns5ZUTTCpQ7taW1Hu3K/ao97++u691tbfn2'+
                                        'rvkbou77Q2n7IT7UevKgB5Nk57mNTzPhc82ZXWJnHr5IynzeG+KV5RSaEAQ7BtPsb7tCeQruqPrw'+
                                        'nnwIBAI5hrPRGh/c+uU6152f9XXuNgB8vCN09ppB533I4+UUy5Odp7AqkeaCz2hcy4PInXuU2hnl'+
                                        'p74AgpcbOYkUNWxHc9AYSvN9Co9kKGR0o50rclKSSmEsV+lRntrDOfC9yTUV3Z/VNe4WACxqHLh9'+
                                        '86Dtxy6VZ9hCGFNH09zOk/AFxZeg8OeU2ZlX/Xml/JEadTDdYzOywJb+NHMSFApngUcudG8BRIMH'+
                                        'NwprSxywYoYntnDP2pLPxEH8TAGweXuLZ00ieH9rRDufQjuy7yT8OIV1GZ5EoUaaXox0P7fUAS47'+
                                        '9/K/yE2AYMdABkGQMsJHihQIBOQbkF8QcBLLseihdbY7tnB+Q3DRZ3Ftn0nbsG1H0epk6ROdUe1r'+
                                        'Xjv37gcSGovp0/ogC+gDNhTmzSt3MBuZ/qwu8DNoBIKtyAJkEkToqOgDVQQCMnNk8ogDbaotPMsd'+
                                        'Wbj/pNLnduU1fSYAWLulsXRNsvzvXXH4CsX2gyj4QVR5Zu9NoRzR455lTih3/+8SPrs34ABf25PC'+
                                        '6CDNBC/22xQeInp0EJCziKFiYrYrfP4BU8qf2pXXtEvb6o1bfesyFc91xeCrFOKF4hnm6Sf1uF4T'+
                                        'g/NAdl+BycV2Fu5lxnXWz28j+ieHd1VXkkU7FB3QzdKrojMBpZJL3CrLIuIHyZnOwTMPmlqxS5hg'+
                                        'lwJgxbpN9k1K9RPtEe0M0nwaRAnHOe0zARMA9OFVMgPFGA7sVeYAm+2LEeqNtVEU0DKYgU09SWYK'+
                                        '5KbivTuxQ9x2DgJKIqk2W2imY/AbB02rfHuir2WXAuDZDQMPNA9mLiPNH0C+H4zz5E5aVGQo0unx'+
                                        '/dxyJ5R5VGYWdn+Kalc3DdZ0J6EnkmaAkBtLI1P5klOFUgQBgcTtcLRPs/cfd9D06hUTeRW7rJtf'+
                                        'XN9zx7aw/WaXkoFwMgMDsQzLg1NxhaZkT82KKyjF67PDHqj9/5s1X25k/2kUcU1nYkg+W4w4OmhA'+
                                        'CSmgzGNjvRVwO7ZOSTR/9YC5M7ZN1HXsEgC8tqb525ti/oftSPQRFH6IhJ/mtM9tvjTIrr/dq9KF'+
                                        'oZ/K8gD/FxqPABRY152ArnCaOYG5B2hsHwsRiQmQGen4Mpf2XnVk+3EHzZ8XmajrmNC2aFXjfhvT'+
                                        'ZW+lk8lACoXeG+WDIind3oN+4+LM5AgSwudUOEev/fLVfwFxQ9Tfjf2ztithKQgRHdCoYsClIAhs'+
                                        'rGy13qc8eNz0ossm4homFABvf7qsqMkx5d2+eGZvkibZN5HX18TZTPRP1bizMeav9NpGl+0bgpYv'+
                                        'HgKoF9L4/+r2GAuNVaNeLUuPHAQ8YxhEf4A2dAphktJ/wZfnNjw8EdcwYe2ZNb2/2z6QvgItOfQi'+
                                        'rdGIXlJP7Qqul+4NZaiAy6HAvEo3K6AoiAHo99iBGfbKKne/wGbDhoJt6k3A9v4Evkdbr6iQ7Sih'+
                                        'KDxjSDkCYktyDv1uZ3dtouWwBXvP3DCe808YAF5a3vj1LfGiFyCTRocvjfF+miV6MqAH+qqiK382'+
                                        '+0EaX+m1wyz0/gtK92oZfUsb7zX2+sUFgIr9EsL+WtOOJl214+YAhWJBRgfZ8EDVcwQ+dAorfDaw'+
                                        'o/2o8qqv+TvXnfiVww8Zc85sQgDw6jsfBZsDe3zSPxifSXa/B+1aLJ3RwznFoH5FEj7BgT6eVuqE'+
                                        'Gr+Dl28P27iwk8kUHNLgh/piV7bA36jg/+I2qnR6cmkzrERz4HK5QbE5OBtIziHBwYUsUITOchkq'+
                                        'jt1uh0n2wcuPmVv3h7Ged0IA8LfF23+1Peq5RkHt746kmOef0pM9CktxiftQct9j2xO9/yKXbWQG'+
                                        'QOFnUPPj8TgcO6MUJpd6gZUE5dzJaG9Hs3wrfuazNC2k9Q++txE+2jEAXk8AFLsT99l5bly6LGIC'+
                                        'Kncv9djRMbRBkcfeVdq9br/jFhyyY0znHe+F/+v9Vfs0Oeo/SkRibqL+fkb9Gs/jK/r0nBzN52+o'+
                                        'a11o2PaqcrNs14h9zeg+BfFoFI6ZXQHTyn2MDRRlwgOZYQVv9dlw1zDcb8nfczgccP+ilfDxzhB4'+
                                        'fCUIAA9jAZkBhFdAZWZ+7LTKgAN9JxsgIT504h6lF4/lXsfde48taX+ueSBzcjqF2h9OQTSV4VU7'+
                                        'zO7zm5SpX79zpvFEZXtUuIGPf40oFcRAEgEQhuPnVCEA/JBI5s65yCeIQoUwWsFPZHO5XPC71xfD'+
                                        'R9v7wRsoB8XhRQA4cxhAdCGLCmjQyG1HU2CDgNedLOvfcviJh+/7yWjPOy4APP3Gp19pcU99Mx6P'+
                                        'QR9SPzkzbJCHCZ31rg4AMKV9efxfgh7tLARAvnl6OS1DQ4dJiCEATphbDTMqAhBPJK1vaoysMJKQ'+
                                        'JxoE4jrpd91uN9z36kc6ACpAcfoQAK7cftMbQYJGC30YDVT67OBzOaDGq714yl4VJ436GsZ68S+8'+
                                        '9LLSHpz3emdMPZoEQdpPMX9a+GSqLnzg76W7Zi+U8Sv3OWBmmbuA7J/G7X0qgQAYhK/Nq4WZCICY'+
                                        'DoBdYQaEYIbbP9J55e+PZCY8Hg/c+/L78EFTP/iKCAB+nQFsQ44XvgAliMgXKEeHMOB3Z4K9m44+'+
                                        '5agD3xrNPY65517+dN1X1wwWv55AIfSEkzAQT7MCTiZ/YfclFhCev2jk9Veg9z+93F1ABKCxCEBD'+
                                        'AMSjA3DS3nUwszwA0XjCsnMnAhCy8MT7iWAAq2vLILj9fj/c89J78H5jHwKgEhSXH1QCANjy/hbl'+
                                        'BnxOG2MBdAaJBV4+de/qr43qesZ6I08u73puU9vgyUmUehcCgNl+EqSqctnrIDBifykKoMYA4NMB'+
                                        'MGIKkDMA+QCxyACcMr8eZqATGI7Gc30MUyePxxRYAUD+u1DtL/S4QCAAv3nxXXh/Wy/4iqvQB/Cx'+
                                        'SMCKAUSXqCxDqEIJ+gGUTykp8ib9XesPPe2rX1pc6L2OqYfWtoX3+dfq7o8T8bSrJ5yA/liK2X5m'+
                                        'nfRSWK71JvsvdQaNCpYgaskEjJwE0ngUkE5AFBngm/s2wIwyHwxGY0MAMBFskE/7x8MAVtch/3Yw'+
                                        'GIRf/+sdeI8AwEwADwWHYwA2B4EmnKAvUBVwQpHbAQ0B+PPJe1dfVPB1jeVmnl/defeyptDViQRq'+
                                        '/yAKJZnmJdvosSqqLnTVyP5wR1aMAuotwwpAVGQADw18FRAFcADEIiE4ff/JML3MCwPhCBKOOqSD'+
                                        'hwPEaJosdDMA6HeH+3u481t9r6SkBO5+/m14d2s3NwEEANswDMB/iCUMqbycEkPkU9WU+XvT69+Z'+
                                        'd94ZJxe0RsGoe6c3kgw+8knbqu6BeH0/an8vev+JdAYyerpXVfiwJa965B4hAUADgQLj2sGDseys'+
                                        'Cg8bFRtJuVjKl6KAcD+cedAUmF7igYFI1LKDzQAYLSCEgDJ6oskMgpEcunwmyAwQcW20v7S0BO56'+
                                        '7i14d3M3NwHoBILNbRkFyOKjfKoTO5CSadUBF5QWuaEs3nblGQv2vq8QeY4aAMt3hk5/bkXH35H+'+
                                        'oTMUZ84fZf2M9Vhk+hczI8SpTGejoc5ZlR6WEMqMhICMbgKQAc45eBpMK3FBaDBidDINpFBq1ErQ'+
                                        'Y2EEK80323VZ683CVVV1yG/KgEqn0zm/RQC489n/wNubuwwAqBgGasrQ38leJP+PZhyRMpEZqPC7'+
                                        'oNqrfdT20XOHXXXl90csrRw1AJ5Z1vb00sb+MyNo95EFjMQPpXyz3r8ufKtBoJxOBpha5oKgx4Gd'+
                                        'M1IMTlFAnAHg3C9Nh+lBF/QNDBpaVFZWBpFIhHXyWJxAK4HTb2nGeIPUaZLgR8MoolHMT5m/UCjE'+
                                        'gEvnKS8rhV8QADYRACoBHAFQ7a4hiSCrTqQrICWikLC6yAm1ZYFEdPUbB15+/tkrR7q2UQGgL5Ks'+
                                        'fui9HStR8yt6B+PQh95/IsPpXwaAUfAhxgHynIrN9kXU1hY7C2QABACagPMOmwVTgw7oC3EAkLaR'+
                                        'DX3kkUcYCKhzxX7ZBIyU6SNB0EbaKbZUCrd0CtKpFL7nG+3XmP1Vc84hgCFv4jfpMxJ2IpGAQw89'+
                                        'FE4//XTo7Oxk++nzyvJS+J9/vAVvbexkAOA+QAEA0Fc2o5JyMgO1xS6oKPZBMNp887nHHPCzCQXA'+
                                        '0u3933h+Wdvz4WgCOvpjbNiXZveA6AQ9+QNG/l9PB1vQP+90AC/GsdMwEhhxPE/TATDYBxcs2AOm'+
                                        'IWh6QwM5AHjooYcYAMgUCOEIAbGbVRRLjRajiUL44lUIPJlMGoKn9/QqBCrOYQaSAAm9p8/pWBkA'+
                                        'Z5xxBnR0dLDfod+sraqAnz/7Fiza0A7+oio9CiiEAXhHUiGpT48Gqoo9UOvX3tm26Kmjbrrh+mG7'+
                                        'dVQAeHZp6+8/3tLzX4ORJHSFYhBNpNigDxu1UnUzoOT6Acb0l2EuYCpGAj6HbQQWSDMTEEYAXHTU'+
                                        'HAaAnv6QAQAyAQ888AAMDg6C0+k0Ol1mAlWPTBQl63SK95zuNZP2p4aAgF7pWBlkcpNZRLCEED69'+
                                        'p9FMAYD29nZ2XbSvobYafo4M8OZ6BAD6AKrhBI7EAGCYATf6AaVeB2OB+nJ/f//yV+f/4NILGicE'+
                                        'AAOxlPuhd5s+aemOzCPh9w7GWK2fpnD65wCwZbN+qqhssQKAWLFJY0Kv8Duhpsg1PAAyacYAkXAf'+
                                        'XHjUnjC12AHdff1cCNhJZeVl8Lvf/o4BgEwA63Ab/4wLSmHj6/QqgJDtP0HVWe1Npjjty4IXYOAC'+
                                        'VdnvyeZFCF+ASRY8vVKLxWJw2GGHwVlnnQVtbW3GvikN9fDTZxbBorVt4AsiABwIAMYAw4SBEgBo'+
                                        'c6IfUOy2Q13QTX4AePs2f+v8ry8YdlZRwQBo7I7MevyDHcs7+iKezv4IhMIpNsGD0b5h/208EcQc'+
                                        'P4tEkBC+fsHpTAo7K81mwEwt97Ey6Ly+oMYZgHyAC5EBpjAAhBj1CQa49977YGCAGMDB6uZYxzPh'+
                                        '23QWyLKUahoF5ALMAoDZ/SQKPpVkw84CALnUz3+DvifYw0z54lgBlHA4DIcffjice+650Nrayo4n'+
                                        'Bpg2uQHu+NsieGNtK/iDlAn0owkonAGoSyka8Lu5H1Bb6oOyTO/vzj9m3+9NCADe2dh15ivLW5/u'+
                                        'R81v741AGKMAGozlwleNMJDZWcVmuACKImsbX4FPI21GgbpUqhkjEKSgEmPYcgxh8kYDVBDCEkED'+
                                        'cNZhM2BSwIE+wKDua6IPgGHUgw88xDrYjgzANN+W9QNssp8inFb9mjTQK8xA0Hcm6/QRGHQAUMtq'+
                                        'v9B8HqHQd0SYx0Bgo3NmhS8AMjAwAEceeSR85zvfgZ07dxq+xfQpk+D2p9+A19e0MhPAB4MKBABw'+
                                        'ADI/gMJBZNOaYjdMry764NT5VQswQshbMlYwAF5b3Xb3v1e0Xt03EIPOvihE0P4z75+yODoAFMPG'+
                                        'SilhdhbpJrQ0E3gmGYffnHsANCBShUG2iaxevpvUe9yFVMHW48nJqKmMSkdM1+re5og5enmMWuN/'+
                                        'y5VMQ46XwsJf/PIXzMFzOpxc+DT9Pc1BRE7qscceCxdeeCE0NjYaJmP65Elw61OvYz+3MAZQaSyA'+
                                        'AKAWYgIy+qVq4LXbUJGcUFfigcll3u4zD6zby+92tI0bAPe/ufnlDc39J3Sh9ncPRCGazOj235bV'+
                                        'fuYLZOk/mwOQfgi1nzQ5nYzAo5d/GRrK/Ph32ijts0qgmC85o1caG7yie/ZW3x1pSHfIr4+jqESE'+
                                        'gj/+8U3Q0tLKfBEWRupaTo4jCfuYY46Bc845hwFAhIFkAm554t/w71Ut6ANU6wBwAYzYH5Ctp9D4'+
                                        'EnWlXif2qxeqkQWOmVt58J61RXkLRQoCAGq77w9vbvl0S2v/nPaeMFAOIJFCAKgCAKoRBYBk74Ym'+
                                        'gXT6T8UgHR+Ah//rGJiCtj+WyJZ2WQlxrCVXo/lsNGP7+b5Df5PQb7zxBkbvxEokfLonqvihjdqX'+
                                        'v/xlOPXUU2H79u1GImjqpHq4+dFXdABwJ7CgMFAXPLu6DF+VrNjjQGZFABS54YR9qi+aV1/853EB'+
                                        'oGsgNunBN7esbmoPBdp6BoHGAJKU/rNlGYCzQD4AiJvAC0Uq1FIRSMf64dHvn4g05TcKO0Qn5hvR'+
                                        'G89onDllW2ixhhUA8h1P+0nI11x7DTQ1NoHL6QKny8kyf7SfXknYBx98MAMAgYTAQfsoCrjpkZfg'+
                                        '1ZU70QRUj9IJzBgAYAkhigTQBNQEPXD03Ko7D5ledt24APDxlu4Dnv90+6ek/a1dgzAQTfDRPxZS'+
                                        '2bigbSq/WFXOAVgxQBK0RARS0T54/KqTYDL6ABFTYYeI3cfb8gl9Iku7zGCgyp6rrroKQ7xWCBQV'+
                                        'gcftAa/Xy5iBTEBfXx/Mnz8fvnPBBTkAaKivgxv+8gK8ggAIBKtGkQmELANQ6KnQ8LCNCb+hzAdz'+
                                        '6ouePuOAhrPzXn8hN/nR5q5T//FR47Pt3YPQ1h2GwXhSHwDisTbokYB5MGhIGKgXdmpJDoAnrz4Z'+
                                        '6vFCrSp75NApX2dbCdvqbyvBj4YBCj2WPiNhX3f9j6C7uweKEABu1Hy73WFk/Hbs2AFHHXUUXHrp'+
                                        'pegntBgAqK2phuseeg5eWUEAEAwwehOgsAUpbWj/PcwPmNtQ/J9v7l9/tNNus0R9QQB4f2Pnfz3z'+
                                        'wbbft3UPALFAOJbUM4A2Fm+DqgwZDOJOoJrLADIAIr3w1LWnQB2GLOFYfIjGy/n1QoRkJbB8ApcH'+
                                        'fKxGCkcCynBj/FTZc9vtt0B3VxeCwa/nBOzMF+jp6YH+/n4WBRAARCaQvltVVQk/evBZeHn5DgiU'+
                                        'VI+NAdiYA7BIoKrYxRzseQ3BlWcc3HAIAiA6ZgC8vbb95r9/sO2O9u4QdPREIIwMQJW/We23SeMA'+
                                        'qmkugJIDAJQ+ZJgJ6IW//fc3odpnHwIAs1c9WhCMJPiRHLpCy8jNx9NnxcXFcPsdt0BHewe4PV6w'+
                                        '2xxMw4n6aRwgGo0yAFx22WXQhSARACgvL4dr//AMvLxsOwKgRk8FFw6A7Hr4GniQASivMqnCD3Pr'+
                                        'gk3fOnTyvhg6944ZAIvWtN318Jsbru3txwggFGMMwEq/bTzLxp1B4QOoORVBigkAmiZ8gF545rrT'+
                                        'oMKjsNo+K8GL91Y599EAwSx4c2FHvsKN4Y6xAgtdI5V23XLrj5l2+3wU4mYgFBpg9E+fizzA5Zdf'+
                                        'Dr29vTkVQdfc/zd4iRggWKMngkbBABpPsikUCto5ABrK/TCnrrj7ggXT5iIA2scMgDdWt/zuwVfW'+
                                        'XtHc3s9idj4IxDNtCttseg2A0H7VKAUfCoAUY4B0tAf+cf0ZUObKwGAkNiwDUBMDO6Mt8RJ5eTMQ'+
                                        'hHDzabSs1VbHWf0O3UNpaSn8+Cc36SN9KPBwhCmn+L4AwBVXXMHMgQAAMccPf/80vIQM4A9yBhg9'+
                                        'APBwWq7eobCsaqnPBQfMqAhf9OUZs90Om2WJWEG9+frKlj89+OrqizY2dUEinkKPVmWj0GT/NVUH'+
                                        'gR4CcsdPOIQyABQermRSuhPYC/+88QwotiWHAMAMAvFqNcSbv09yx+RFwkX8Lf+2+Xvm68hXyi0+'+
                                        'l8FJYxI33nw9bN2ylWVnyP7TJhoB4LjjjmMAoIIQAQByGK/67ZPw4lJuArIMMFImUMsCgIBGk0wc'+
                                        'tLiUClVBNyyYU5O8+OiZMxAA28cMgNdWNP8FAXABAaADIwE3hhk+r5sL3aYa4wFggAAkEEihYE4U'+
                                        '0AvP33QW+JUYDISjhoApXqbhXKsIwIoNRkr2yJ/LbGAG13D5gXz+ATl2ZNdlliBb/l/fvRSaGrez'+
                                        'Wn/yAVQpnSsA8L3vfY+NC4hzk/N45b1PIACaRgcA+bopCkAUJFMZcNoVmFlTBIfPqUlf+pVZ01Fm'+
                                        'TWMHwMrmPz74yuqLNzZ2AoWCMfQBgkEv+L0uxgAgAUAxWACMKmEwASCTJBPQC//68dngzUQhNBhm'+
                                        'h1AMXVtbq2fRFEsBmUEhGMEsaCFseaRPAy23wyzAVQiYBJvU1NSwfaTJgsEqKyvhkssuhJbmFvQB'+
                                        'AqgfdmMoWADg+OOPtwTA9+95HF5Y0gj+ktrCM4Gyv4Jvw7EExJClKzEKmFkThCPm1EQvOXrmLLfT'+
                                        'vnPMAHhjZfNvH3x59Xc3NCEAukLMCSTPvxRB4PE4Jc0nc8B9gNxcgGIJgBdv+Ra4U2EGAEGDlDMn'+
                                        'D5mYQB5OzecEUnJF1NjRMaKQQ1TviLF82khbxavYqBn1A9J5zOP79DuiEIQ2EuStt94KJ510EjQ3'+
                                        'NxsgIlBccumFCOJm5gRyBsheuwDAlVdeOcQH+N49j8G/PiUAyD5AAQygF4REUC59g3E2cbQ66IGZ'+
                                        'tQiAPWsG0ATs4XbYLZ9rWFgUsKr5Fw++suq6Ddu6oA0BEIkm2No2NocdgsUIArczG/eLASFFNYpB'+
                                        'sgAgNyDBncBYH7x02zngSg5A/0AWAPR68cUXMzMgOluMr1uVX4lGn4tsmxCeLHgr4YviDnMNobk+'+
                                        'kI4TYKONjiEPngBw8sknGxk92k8MxgGwkzGA3WYfYgJOOOEEBgAKDcX5KHr47m8ehecRACwMHAUD'+
                                        'UDdHUev7wnE21uJx2qGmmABQDAvm1nZe+JVZe2EU0DFmALy9tvWGP76y6udrtrRDe2cIBjFso8Wd'+
                                        'yPtXMOYs9ns4CIwRQcEAqpQYAr0cQA8DY73w8m0LwZnoZwCgRgCgTj///PNzACBKvuUyLzNtyw4f'+
                                        'uzFFFGtw7aWiCxK6eJW1X67YEd8R4/dC8wXwBChIeHfeeSecdtppbFBHAKC+vh4uuviCYQFw4okn'+
                                        'wg9+8AOWGMrOCyiFK379KDz3yVYoKq1hmUAYgQEUfRCYhB+KoPDTGbbPiwCoLvHAbGSAo+bVbfv2'+
                                        'kTP3QwD0jRkA769vu+RPr65+cNWmVmjp6IdwJMFn9JIwKAmEcWfA5+bmQJGqg1XJHBiCyjqBr95x'+
                                        'HjjiIQQAf2QO0SB17tlnn50DgHwgkKMBs9aK4k1RwyfMgRA+HU/CFwCQizaE2SCwiAhCjkBoI/q2'+
                                        'AkBDQwOcf8FC3LdDNwFDAfD1r38drrnmGuiUEkEV5Dze/Qj88+MtOgAKywRG4xhFRbFPMxmdDTTw'+
                                        'uexQW+KFOfUlCID6ZecsmP4lp936OccFAeDD9W1fe/iNtS8u29ACzW196LXH+FgA3hwJX0QDXo8L'+
                                        'N6eRFMopE9frA8kECAC89rPzwR7rzwEAdf4pp5zCfABB6UL4VuZAttnU5IJOQflUKEIbCZQ22k+/'+
                                        'RSATYJKreYXpoN8Wx4lzi2O7u7vh7rvvhjPPPBOampqM65g0aRI89tSfIIOeeGlpFUZLAXA6XAZQ'+
                                        '6boIJDNnzoSurm5WVsZTwVVw+a/+Cs9+RACo5WMBeQAgCllpbgYBADRRaaWBiu/9HgfUlnphr0ll'+
                                        'sGBe3evnHTnz2PwsUkBbvLljn8feXLd88bpm2NHSA6GBKJsOxoRv0zdG/TZwuhx4AU6eJhYmQKSJ'+
                                        '9USQMAGv/fwCBECfAQCyg9Tx5CS52CCKfQgAzI6hFQsIAMj2XgYBfUcIX0QQwlQIB5I+M/sh1ASb'+
                                        'UKLn3nvvZbV927ZtMz6fMmUyfLD4TRS8H6orGqAoUIJOqof7RMBL5Kk6iJiAfodN7sLfrKurhcvu'+
                                        '+gs8+yECAKMAFgbm8QEoomEleam0kQGkEJBYgHSuiOoByv2w15QyYoBHzzxs+rfHBYBQJFH3q38s'+
                                        'XfXuim0ljTu7kf4iEE/xNc4FAEjgmr68mQP9Ag+ygcNuyx0cYh4rrwegwaA3fvkdxgB9en0/AYAE'+
                                        'RAUTovOthC82sxkQApIjAGH3KQcvtFrWfPEdwRjUoeJ8orxc1l7hQ1D18f3338/MlRkA//7Pc+C0'+
                                        'uaGqsg4C/iBf9SunLA6yobJ+/kkNdXDJLx+Gf364CQI6A+SMBehuFNVhkNanmb3XmU/j2k+JNioM'+
                                        'DfqcMKkyAPMQAOccNfuOg2dW/WRcAMCwz33fCys+emvp1n02YyjY2xuGGK3Po2QBAHpKmJhA0ytx'+
                                        '3W7sRIwUFKnWj/kAqSgzAYt+eRE4Ev1shg81yoeToL70pS8ZoZnYBADkitvhACCbAGHLhccvvivP'+
                                        'AhKePn0us4M4TvwOdTixE/32Pffcw6IA4QNQIxPwypv/AAcBoKIeAVA8FABDNDoD06Y0wCV3Pgr/'+
                                        '+GATHw0UJWFK1uzEUOMTVIqXyRW+kQmkMBXD8DK/G6ZUF8G+06vgrCNmnLvvtIonxgUAag+8vOrZ'+
                                        'Vz/edOqGre3Q2R2CGKKQBSDkBzAQqJIpUA0gEBu4qNPtuq0WmUA0AW/ddQk4WRiYNQFEjTRxwqo2'+
                                        'QAZAvqlfMgCEcIUtF+GeGSiC8oVTKEI9wQxkOkQOgMb7fT4f+87PfvYzZq5ojF8AgOz7W++/CB6X'+
                                        'D2oq65kJcLk8rEp5OACUlJWhD/AYPPXuel4QwgDAnWoaUIqzpfe44HOSWQYD8IUzaW5ARZEHpmME'+
                                        'cNDsWu30w6bvu0d9Sd4l5gsGwOvLtt/x0Msrbl67uRVDwT4UVJzXBBg+gMQEhhPIwcAEgECgiyMT'+
                                        'wBJBaPvfuvtS8KTDOQCgsu4jjjgiJ/tnHtBhFz5MKCg+N0rCbTZLT1/U+ZsdPTpGFjx9n4QuhE+v'+
                                        'xAA33HADHH300SwRJABQX18HTz7/JILfgZ59Lfj8Jfjb7qGrgcsiUPiqoL946k14d00beAJlCAAP'+
                                        '7ncwyk+KollJ+HIVELf/aRYBUA6gKuhB+18Bh+xZ13LhV+fs43HZu8YNgP+s2nnSk2+u+deydTsx'+
                                        'EuhBGxhlkQCoVgCwZesCjNlCCiv7ttvwQjPYscgAb//6MghAzMgDFCMAKK26YMECIy7PN6QrfyYE'+
                                        'LrOFmR3kjJ5M93IoKARPVE+vBAgSuLwJ80Bp3B/96Ecsry8qe+hc1dXVcOCZF8HapnZwo/1XVCfr'+
                                        'Ay1PV/PhdCcrAXd6i8HhLgKwe1C5HNi/qvEwLX7D+n8aZNPawv5n0qwSn0LAqdXFsO/MKth3Rs1b'+
                                        'Zx8x4ysIgLwDJgUDoLUnPPWe55as+GB5Y6BpZyf09YfZoIPhCKpZ4Ss5ZWI2qUBEYYkgAoCCtv/9'+
                                        '+66AoD1tjAVQIogybDRxQg7PzG24RRpkcyDnBkRCx0rwctZQlG+TsOl66JXGKIRDKK5HAICSOjTD'+
                                        'RwCgoqICDrvgatjQ3IcAKOWFnbTgY76uZpGSjS8Nq7ogg4BJa3YEgL5wtHyfsvZrQwFALFMacME+'+
                                        '0ythr+l1oHWuu/v2H5x37XByLRgAoUjcfv+LK99/Z8nmgzZua4ee3gHuByg8I2gwgU0IPbdayKhv'+
                                        'N0xAL3xy/5WsIISWehEAoCnTZALMzt1IFTtmcyHn8bmmqYbQZSdQpIipkXNHgzK0Ec2T4PMBkQBw'+
                                        '3XXXsaSOKO0Sw8GHXngDbGgZBHegHNHm4bY8T1czZ04hYKnsoVnoaXBAiKdIZdetzQpf/K2JxbP4'+
                                        'q9Ohsvz/rPpSmDuzAZo+eeGk3/78xhcnBADU/vHepv95+s1V16/d3IJxMPoB0ThfHMIwAaqeHZTN'+
                                        'QO4oIcsDJMMcAA9cBbUBBwcAfkYAIHtKkyetxvzzlXeZ08DmWblyBCFongQvtJ0ETeemTVTwjjTU'+
                                        'LABAUUCnPs2bhbIlQTjkwp/AhrYoA4Bi11f7ytPVbD6iPrePltHhWi9CPyF8478czRdMoNF0dXyt'+
                                        'LfPBtOog1FcWIQNUtzcueWOfu2+9ph2GaaMCwMptnUff//ySN5as2Q47W7rRD4igg5LRKcyk/QYQ'+
                                        'cs2Apol5Ab3w6R9+CJNorR+dAUjzmjCkOvDAA3OWexlusSbeT0MdPjlUpOPl2b30OY0g0vko+0hC'+
                                        'F7Z9uOXhzAC4Hp3AU085hWUFBQDoNw++6FYdAJVZbz5nNrKIWDRpkVyTKPTBMwMAihA4SADgISFF'+
                                        'CaV+XgJWVeaHSZXFsPf06lcuPG7uiSPJdFQA6A/Hi+/55+IVby/eMnkrOjl9fYMQT6T4o9/UrBkA'+
                                        'nQ2GsgDoM4MoDOyDxX/8IUyt8LOCEGqkgZs2bYK99947R5hCyPImZwPNuXquWbmZPTqGhEwCErad'+
                                        'QCBGD0c7V4AB4Prr2QQPMapHm8/nhQO/cwsCIIbePC314mdOHvd/dKYafiUMk2iEsEGi/oxh+6lE'+
                                        'L+BxQHXQC0EEQV1FAKYgC+wzo/q7Zxwx6/cTCgBqT7+1/oGn31x52Xo0AxQOxqIJPqNXJIRU2RHU'+
                                        'WYDVDOoTRmmaN+UB4giAP10N0xCt4WiM/TYJZ+PGjQwAZk02C1yePCLn8uVFHEQ6Vzh0VKEjUsxG'+
                                        'd49xkogAwDe/+c2hALjgJ7CeAaACPXo/Cwk1TQyHjrLlxPwgUX+GCd/vtrO4n0YAaYWweuzP2ZMr'+
                                        'BmbWl+5z8iHTt004AFZv6zzmt//89LWla5q4GRiI8DhV0TXeZjYBcm5A4QBIRzkD/OkamFETNKqC'+
                                        'SUAEgAMOOMCw2+aQTha8cPIEvYtFGUjIJHQClKzp4xW6GQCUByAAiMIOMTFk/2/fBOtaojoD+IZ1'+
                                        'AgsRvjnsA/2+fSj88oCbP0nEjSxQ6of6qmKYN7361YuOn3dCIacY9VX1Dsbcf3hh2ZJFn2zcc/O2'+
                                        'NgzbBjBuTugPh7AZYWGuLyCiAgkAyABLHvpvBEAJYwASCglry5YtLBUssnFWiR45109NVAVR55PQ'+
                                        'CUhC6PLCTRPZBABoODgXAB6Yv/AmjAIQAEUVzASMCQB5HT8ufL/bCWUY8tkVmhCqQrHPDXXo/E3B'+
                                        '/tx7WvW5py+Y9UQhpxkDLAGeeWf9jf98a83PVq7fAe0dvRAJR1maUowNZM1A1h8wEkManx2civfD'+
                                        'kr/8CL3WYhjE79O9+f0+NmVajgJkoQvPXWg6CZk8eBI4bfReTursiiZ+lxJWN910EwOAqO+nje5h'+
                                        '/sIbYUOzAICe0x9NV8vXboR97KmbTPhFXi58MReQsn8V6APUVhTDnCmVOydXFe19ymGzegs51ZgA'+
                                        'sGFH95SHXlq2/KMVW4sbd3RAqBedwSQfGzC8fsMHkLOD+DktEJGOQTqBAPjrdTClokh3AjXsPIwC'+
                                        'mhrZEirUmbKmC5suZtkSW5DQSetpn7kuYFc3GQCisocDwA/7LrxBB8AYTICV8DPc5tPfQb8TSnxc'+
                                        '+Aruo+ngAa8bajACqKtE529m7Z0Lj97zusJONkYAUPvrqysffOHdNZes27QT42AaG4hlVwtXTeGg'+
                                        'LZvYoIfCZ9JxSCEAlj58A5vBGpISQdubmmD//fc3BmvEnHuRmBH5eKHtI8XruxIANxMATj/dmOKl'+
                                        '6LmMfc+9gZuAQMXoAGCp+dlx/lK098VeB/ubNsr8eZw2dP68UIOKNLOhYnBmQ9n8Uw+ftWWXA+D5'+
                                        '9zfNf2f51k8+XL7VsYNYIDSIFJ3iF63aJBBwNtCYF69wJGfQBCRCsPSRG6E26DbmBRQXFzETQFEA'+
                                        '/U1CFkIXG2m/XL+3O4RPjQBwy09+wgDQLiWCSoLFCAA0AS2R0TmB5kyfXuFDgqZBtDLy9F12FkaL'+
                                        '+n9y/gJoDqrKAoz+Ufv/ev5x874zmvsYMwCo3fPMJ4+9u2zzuavRF+jswpAQWSCVFr6AavIF9L/Z'+
                                        'QkxxSMcRAI/fDNVFLvQBIsw/8OgLKSxatChbD0DFGVIYWKjAs46flqNYipi0AqObcWxutHrYnD3m'+
                                        'MI3vD/HVyuj3qLhzPwTA+uYweIor8N6lPID1leaCQPf4NV3zaXCnvNjDHD22VJ7G5/+R7acJOiW6'+
                                        '9k+vK4/OnlR+4DcX7LHmMwPAw6+unLd2W9un7y/Z7Gra2Q6h/gE2dYwlZBXJFEh1Auz5fwSAJAHg'+
                                        'J1BV5GSZQJu+1oDXg5qOsXSWArMLNhXwaKk8fSt/TxnnXYtfUSCRpMWro2j60iAmwlaUl8H+CwkA'+
                                        'EeYEKnZvHgDoeQEp1BNgJZakT4No60vQ2WPfzGSMBBBNzCNA+FH7q8uKoBq1f+8ZNX+64Ph9Lhn9'+
                                        'fYyz3f/c4vvfWbL58pXrt0NHRw9EKSIgTx0UKRMo8gN0Oh0AiQFY+tSt7NFnFAXYbPpYQUGPEB3n'+
                                        '3U2k1ZBKuwgAVZWVHAA7w8MDQF6yVgI5+T608HMZaj1pvyZl/hQ21sFXB3dT4gc9/+ryYpjeUB6a'+
                                        'WV++L2r/1onqooLb46+vqt/Q1LH0vSWbK7Y2tkJ/XwjisYT+8CglxxeQTUAmNQhLn74NKvx2tuy7'+
                                        'WHTxi9wICHW1tXDAeT+GdTsHweMvtwaAhbOn6Ys7UEFtGSV3bArLsLLnq2b0hzHhe9J+J5Xhe11M'+
                                        '82sQAHvPrL114bHzbhvTNU/EjT/04rIrP1i59Z6lqxuhta0LwgNhtromu08lmwwyAKAl2JDwxhd/'+
                                        'AZMqAhCOxMZlj+UmK1Z+VVdy3k4k9PxF6Ix960ZYsz2EAChjD4Ck5wFnKT/3asWgkIvW+Q14wO92'+
                                        'MAcvo5d/KVrGsPtssBiZkrJ+ZcEAc/5mT6neUF9ZfNBpR+4RGsv1Tsi9P/baSmdbd+g/7yzedOj6'+
                                        'zc3Q3dWLtjHGKldBzBASkYHCnwBKLPCb/z4DJleXASGb0ZzoHUXkzfMLShuO341+1ob0OceZkr15'+
                                        '6e/xNT4djq7ryl8/Dc29SXC6i/S1/uzARszENbEXPgxMzmORz4n2nmu9ptM86ELX7QIDhU2n/iAC'+
                                        'pYq0v7IE5k6t+sa3vrrXC2O/6glqj7y6Yv81W1ve+XDpFm/TjjYIsYKRhL4ANC8Ny64ZRE5Tmj3+'+
                                        'BZAJqEqICkUYEPRZxblPGVOMeYa5SMgFyO5rCp/CRZpud6PtLwO704ehr1t//q8NZAZg1E4ZPLTx'+
                                        'pPUUy5tX+ZBH/YgF2HMCHUj9Hjc6mgEoLymCg+fW//mcY+cX/ICoPFc+ce2PLyy59qOV2+5avnob'+
                                        'tLRyU5BgtfZgLB+TlSntTPGNblRhqxvwVUblahixDgB9R1ruXVy+MWxujKLuBiSwBJeYHU3P+6U6'+
                                        'QCebOYU2wBjbz+hhHoVvQbTznO5Bz/JxumdNf1VMXj/NvywvDUBZSQCmNVRsOOGA+sPmzZrSPa5L'+
                                        'n8h+eOzfK21dfeEX3lu68YR1m3ZgVICmAEO8VEqv6jWWjhHrB2j6BtnVRIz5hPLEUiXLDBIrKDks'+
                                        'YbqdCaP2QjtSXIeNa7xi16Me1WBBF5tI62IDOexBWRmd4vUZvmKKFwFA4Z4hEz7ZfbeLngvoQwAU'+
                                        'QW11aeIbX5p2wgFzpy4a/3VPcHv0lRW1ja1d77+/dPOULY0t0NNNCaI4n8bEzihPH1f0B0yr0mRS'+
                                        '3VwY08qzQMj5m/2WeJUFYHFLu5oVhJkzAKkwm5/Rr4aWry9Cr50KN+z6XMBsJCAoX9h+MP4m3qPj'+
                                        'XWj3iwJeqEDhV6HXv+e0mh+df+L8uybi0ndJzzz88vIFa7e2vvrxis2epu1t0N8bglgszpxCdt85'+
                                        'k0eF8G1Z7RcmwHSMeeGJoUBQsu5dzp2Zy63G0gWa5dvsDm7jRbkXXSdpLQmeHu5stymSxvPvKEYi'+
                                        'yOz0aYbwnSh8mnlNmk/0P39W/ePnf22/hRMlq12mGo++vOy8ZRt2PPLx8i2ws7kDBvoJBAkOAnZm'+
                                        'IXixvJxNei8vNDUULCLrlgOAHAfRxAxD7na8t63lvDCZsUiGStUUlrOnOJ2GaVU1W82jgEnrzYI3'+
                                        'Vvvg0QGZDD8Jv4QLf8bk6reaQslv/OqiIwYmSk67lBvveurDH+7Y3vrrj1duhZaWTgSBXjzCQKCZ'+
                                        'hG0zCVo2FTJYTGaB3UXWYcwFgHx7iokYhmOFobI27+DVWVzj2TN8UdhedOrIsaNEjTF3TwhcfEsT'+
                                        'mi8BgR0nHD7+aHiaWEsLcZWjw1cS9MMeU6uWf9gcPe6Jq4/pmPrdp5Vp5V5487aTxp3T3CUAOOV/'+
                                        'XlGeu+EEdnE/feTdn7Y2t930yaqt0IqRwSCNGhpMoOlCs2UFL8yDxAC5bCAvPyP5AznL0g71EXId'+
                                        'xDHetjFQwy/HYUfPHOmdBE/xuU3JmoEcbRevRrgi3usZPub08eOE8L3IIFz4AZg5uXLz4rb48Y9f'+
                                        'fcyW6d//G3MtE6mMRiw4vcILi8YBhAkFAAl+dcsAmzruRAO25b4zWTxz+8Pv3N+6s/XyxRgetrZ1'+
                                        'MxDEY3H2vCA25CkLXjxsSh2GDUDJXZXc0H7BCkN9g5xbHqUPYMTnVFmMwnGj0CmGdzvszLZnj4Gs'+
                                        'pgMHQVbz9bOJ38qhfJ71Y1PXkfZpoY3SoAj3ytuWdSRPfPzqY5fN+P7f7JBjeICv04DvpyMjLLr9'+
                                        'G6MGwoQA4JSfv4yCH4QYXowLISxP7MULzJT6nMopc0t/39HSfukSli7u5uaAOYZ8iFNTTBqeY//N'+
                                        'TmBuiJjjGAow6ILPsoIkfA3ysoA0/Y4dYteFQhRPTh0BgD0zSBpmViQ7kT2THNrxHzVsvUT9iv5U'+
                                        'ZS58O6P90hI/A8CUurKWpR2pM5689tgPUPPdivjy0I2AwHiHHsb9n1EAYdwAmP2DvyuD8RS4URXk'+
                                        'mVygPzWINgJBideZOXlu6a/7OrquXLKmkfkEob4BNgOXVfRmckFgFnYOG+QIXQIDqNlH1lo6hUNv'+
                                        'V67C5/MNVEbtJAxywpxMy0U9YxYdZuui5DCALnBxrJCTbPdBOHv8WUkUKpLDR5Rfhja/rra8aUlb'+
                                        '/Fsfbu372OVQ/QqzF6A7Czmv4j1rZBpox477zy4IBOMCwNwfPoPCT1MOW1KxHOGr+mZLprU0xsHp'+
                                        'Y2cGr7NHB25Zsnqbsh2jg96eEMT11TuyM2XMwpb9AQvByzkCdhVqruDF+kS6kLOTS/jTxOx2ruVk'+
                                        'e2njTxmzGI8AYwnknJvNCtz0Xjh8MhB0oKjsGUcKK3ZxofADAQ8EiwJQURaAYFlw+Yc7o5euahnY'+
                                        '4LKrHl34aV3QVpsMCFZCSDO2CgHBmAFw2I3PKTv74mbhy4K3Sa9sI78FKTV26NSi8ya70z9bsa6p'+
                                        'iIpKKVlE6wIkMEJIp9LGQ6H0587qT9C2SgxJINB9BEUChKKKB0XqE0zoFQVMGk0bLVrBnjuoqCY3'+
                                        'QdEpXDCJPhuZab4mhZZZoSsSC8g+QC4DaAZoKFx00LxElwuKir1QVOSD6rJisPkDr72xZeDGlr5o'+
                                        'OwrfpQt+uM0KDLSugFbqs8Oyu04bFgRjBsAUDEXs2acvCk2XhS82u7whOgkIsfl1gUP2Kbf/tHln'+
                                        '26xN29qgu6efPfSR+QXJVHapV8j1+AUIxPMJFEU8sII/vkYWuvzEUHG88dRQacRRkRJIRtY5J8so'+
                                        'vYL4XH8vzIIivYesD6DpLGBQo8oXtXRSoStSfnHAB8VFXqiuKNG6Ms6H3t7a/+BALJV02hjqU7qQ'+
                                        'k/prymITIEhDlgmYSRiMpbRfnXcwLFwwPS8IxgQA9EatKN+ge5PQHVZbPK0la4pc1YdP8l2lDfYf'+
                                        'uxFB0NbRw4pLY5GoMb1LPE5WMWYHqTkCzQVDrn+QwwaKJGjzk00Nweu5AkXJ3pwFA8gdJ9O+LPhs'+
                                        'tg9ExpuZHFophR4jE/DTJBYfOnsIgJKi9rU9mT8s2TnwFiLGxs0PE27S9JrQ3yelfTIQZEbQ4sim'+
                                        'UysC2ju3f32XAMCs/WaNJ0E7pY3+dknvnbTCCDpcyv51/hOnerWFzc3twaaWLujrDbGZx3HDQcwY'+
                                        '3SvTuyIzgmEGFAkoVmDI+gGG4KX3oAs9q/VctaUksyFwxdB6cySQBQlfGoH8DBtz9Hw+Dxc+vlYi'+
                                        '5cccnk8+2BF+vKUv3uKwK04lV6hC0AnpNa6/JqT98ndyzEEoktDuPv8QOG/BDEsQjBoANZc+oVCt'+
                                        'GgzVflnrhdCFwN36e5e0j226SUjXFbvq51e5v+FOhg9p2tmh0sTTUP8gRIgNaEaQPjmEp5Gz6WBF'+
                                        't9+KkSsQj4fNrlSeBQnkgsL4LFf4sikwOsn4W9H9AFMHGmsTZU2ETfc9KJJwe0jrfeDze6C02Acu'+
                                        'f6BzY3/m1dVt4cUUJTm4OZUFL16FoOPSFjPtMzOCAYJ4Mg3TqgLa27d9fZcAwIr2hXCF0D36e3nL'+
                                        'AQF9jxxE1BRldoVn7pygemysv692R0s3dDM2CEM0GteBkGbj52KyrEHhpgmkkOd99nj9GcLibylV'+
                                        'rCi5aWPZTOjSHgKA7Ii1YgjeQYJ3uzC88zDNDwZQ84v9ibaEfcmytugHPYPJfnSiqcZT2PDhhB8z'+
                                        'bVETGGQ2EOaAeZ+hKLLAecgCRw5lgbECQKZ/M+0LLXfrwjdvViCg79FKRnYWLrrtvn2qPfvVudLz'+
                                        'Qz19RS3IBrQWQTgcgSiahSQtlJiSHUUhBEnYkB1eFoLJsoZs+012X/YF9B2KPNorACHlAvgj7PWw'+
                                        '0s7XRnS7neD1eFhih0K84iI/RGyuxhUdicWNPdFmNvrBGUr26GUtFpotCz+qb/Q+Ir0XTJCAoc6h'+
                                        '1hdOaF1/Xjh+Brjgd28r/17RDDoAzB6/sPmy8L2mTQaBxwwAyEYKSjqjZcr9zuCcCtce1Y707MFQ'+
                                        'yNfR1Q/9aBbCaBYEI4gFILS0yCFIsbvJ6RuO/hX5eB0EOckekECiMgPDBW9T9WVouI0njadUrsfj'+
                                        'hiK/h00WjajOlvW9qXXbemLNSaQ6PXQWNJ0PADH9b7Pwo7rwxSb2yb5BjkNI55xS6QcrMzARADA7'+
                                        'fYL2ZcH7TH/LLCC+54Asm7AcAoJAoeGSUp8zMKPEObnOo03VopFgD5oFenR8OBxjdQY0wpikB1ml'+
                                        'dTAYTwcByM31CfdBMWm5JHADELI/AYa/QWEkaTo9L8nBFp+0g8vlBBcK3uOmgSHu4Ts9nlRfxt6y'+
                                        'uS/VuL0v3olCSKO/q+rVbWbhm02ATP8yAITQw6ZXwQRmp5Cdh2Zrlfhc2rK7Tt3lADBTvxC8T9qs'+
                                        'GMAJuU5kTiIpzRZSAg3P65pc4qxs8Kn1fiVRFR+MOggI9NApYgRKJFENYiqZYpNT2LCzCCXF+joS'+
                                        'S8jDAooECpE7MPIIzKarbPYSaToJnZ4JTCugulwORvd+pHqXx62l7c5Qa1Rp3daXbO0YTIQyeHIU'+
                                        'vE0SvHiVBS822QkUABDCFQAIS5vMAgIolgAoD7i1xb885TMDgNuk/WKTzYDZBMhmwJxJZM4m5VSQ'+
                                        'zTIoDLXMa/fVBRzl1R6l2q0lStKJuIvWKQhH4hBjK4SnIEnmIZXWl4zNLhuXs9wKgOE3gB6yCS1n'+
                                        'Amexu3huAU/gkND5+L8LbE4nqrZzsCuudDaH0x1tA4n+SDyd5I9TlrzG3HStHK8XCgAh6M8dAARt'+
                                        'mx1AM/0L7RcmIB8A5CxiDgBAGmBCVmBMjwKyFXvs7kqvraTKq5YFbFqJXUv51HTKFadl4pEVUhgK'+
                                        'JREItJQNSzVnNKOYQ1GyPoOh7fr4gINNTrXp+XpO9ardkU6AiobH1t8RzfR2RjI9neHkQCyZSbGV'+
                                        'xmkwNEsu8oBNoQAQAhROoJkBzGbAbAKEI2icgwAQ9Lq05b/aNSZgJCdQ9gfMkcBYACCnnNn1E8UT'+
                                        '26MASevUUq/D63eqPreqeUo8Nr/PBoiLtNelavgvQxPu7Gga1JyiDUURC1xoSP9p/C+d1JREXFOi'+
                                        'Sc0W7ounBwYSWiSeUWLdkWQ4mkgn0hpf+kkfARdCN28y7RdiAswAGMkJlENC8Z0cJzCOodVeDSXw'+
                                        'yk3HfyZhoOwIWoWCVmGg+K74HbPwrVjAYAPzJtiB141w186BTBFw2VCRFTsG3ngu9sA7G8sY6SEd'+
                                        'fifNpmDiazKjJSMo5HAiwx7JoRd70oi1alPknIAxFDtkjD6P8K20PwNDM4Byti9fGCjnBeSEkPy7'+
                                        'Wm84rnX/+bzPPBEkmwMBBDkjaHYACwGADXKFnxcE0saulUmB07555qDRB/JIr/D81Sydy1/TTO+t'+
                                        'hC4zgBkIZu23AoBVFlAGghz/m7OBOYmgwVhS++3Fh8LpB0+dMAYQ3zWngoUpkJnAKhUsjxPk5AAg'+
                                        '6wSanUHzgJO59kC8B2kfmF5zh/CH7wPN4m8NrMEgs4C5UEMWfD4AmJ1AGQQiGWQGgnlcQB4xNM4V'+
                                        'S6Rh3qQSzYr+xwQAaiMMBslOoXkwyPy3WfhyHkD2A+RzDHEIYSgTCCCYaxXAYr9m8bcZBFb7MmCt'+
                                        '9eLvfMK3AoGstflAkLDYxP6U6XeMIeEB9GAevPwIOPmASRMOAPF9q+Fgs19g3szDxVaCz2f/hzMD'+
                                        'w5kEMF3zSH0wHBC0Ajarih0zAPI5gmaH0AwGMTRsHgXMGQ4m7d8Ltf/VPNo/ZgAMAwLFJDizVsvC'+
                                        'zqfxI0UA8gZgzQbydeX4AjDUNIzUzEKX92dMnxdC/1aOYD5zIDOCuTDEzBw55yCnNZ5Kazsf+Nau'+
                                        'qQiSQGCmWbNzaDYPwwm7EMFbnQdgZO23+nssAJA71Ir6C2EBMwjyRQXyq1UpmFU1EM93anzywZb7'+
                                        'ztrlAJB/J59jls+WCzofSdMVsAbASNRvdW3jAYAMBDMoRsoB5ANFGoYHhlnYVowyhI2IAbb89sxd'+
                                        'VxQ6DAisgFDIq9mzH87GFxz+DSP00QJAfi9rvPjbvM9KOPmAkYbCWCMzzO/lXOPm+0YW/mg6Ydgm'+
                                        'gcCqk63Cs+G0VzV9p1CB57PzwzmAo2kjMYF530hRghUYCvlMPo/VNRQsfLOwxt0KAIKVZppDytEc'+
                                        'A3mOARiq9aOlfnPTRngVzSwsccxw22iPMZ93VFovtwkFgGgjAGGk19G8t/os37mGez9c0/L8rRXw'+
                                        'eSHvR7tvyHWNRfCj7YQxNRMQrM45EmPkO6ZQgO3Ke9RGeD+afSOBDCyOGZfgd3XnWLY8gDBfhzk7'+
                                        'J+8fDaDy7TNn+wpJBJm/AxZ/m/drI3wmflN+bz42Z/9ECNzc/h8aTCqO2A0HSgAAAABJRU5ErkJg'+
                                        'gg=='
                ,   minimum_button  :   true
                ,   minimum_image   :   'data:image/png;base64,'+
                                        'iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABGdBTUEAAK/INwWK6QAAABl0RVh0'+
                                        'U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAADXpSURBVHja7H0JuCRZVea9NyL39a21d1V1'+
                                        'VXfRe9M0jQp8A4iAyOKCIiMfzjcgjejnN9987uKAI46jDuIojgN+MwiODOAyOoANiMiI0FDVNL1Q'+
                                        'TVd1LV17vXprvtwzIu6dc+4ScTMq8r189fJVV9cju6NyfZkR95zzn/+ce+65VAhBvnPbvDf2nSHY'+
                                        '3Df3Sv/wr074ZLHLiUOT36fWA2q9Runl90zeU/mc6Xv5+oDPkvBv+r+XwSO8x3MK/wYOwLgsHFV4'+
                                        'uJ0LMg7HREBIDsCvAK/n9HcI+JtF+E3fwXtCFuG1GXjtIty34SM+Ud9F4O/lgeAp9GvmJvQ/5jVE'+
                                        '2Ogx/J1+375X193/nVz/Xfgb1m/Ff9cG8fi5vG63SyppOnoFuHuCkU7A5ImvdKPxx7T/dRoTZJLC'+
                                        '9H0+9hwVBgUewNX6MBIBJ9WLbXFbNyD39AJxM0jtFo+TvT4nk/CxHHw8JSLFUMoiB5yCMIR9viiP'+
                                        'DihCI+2QMy4lT6UYfTLNyOFqmn6jkibn4bu6GRiAwBJcnxC0NlymIJbQ8G6uI8hCV/02DxWIaoW4'+
                                        'XBF4wncI68vt86AbhQD7K3QEALSe71CXyTkpXOyI22c74uUzbfJCEPpzWwHZAoKjTKMIHllHW1jM'+
                                        'SiPBCYUqEfrgn+XhvTwo0HRPkOehVeJ3wG91Ci45knfpwR0F8o9bsvTLhRQ5v4Lak2QbVTcfvnS+'+
                                        'A8qIJ43no9EATwAVQSKCOWE8N3POVJ2/+QWhtZom/soACVwpCQyCYH3kgwGCdDqk0WhI+B9G4EyP'+
                                        'QMBSmTrLv+BSz/mh803xfS1f3IafyIA54yC6ISLAPY4kfD8KNwUjl4LP4PuupRzUwDpeF1d/24N7'+
                                        'ELyGeyE/5zIauhdAFHn04ANZRpeqGfIvOwr076qi9UCa985RHkifYmMKjnWlUiGu6xIz7ni+R2qC'+
                                        'nGoqNDIWLvrcQYQEKymxiLkD/J5X73JJeSNcgDyhdUYQ3W6XLC0tSWVYCSMkODOX9Ghm9ywtvnEm'+
                                        'yL6xDRCPr6Nll1IKvlEYbU8NEkA1ycPrYxlKwFLlcxQgGwJ7hOXrURHAnZAGfG8TNKrpqYHF7wPX'+
                                        'QMquhOoqQPhrwPW8Js2y81XHfWALaXy0INr/5AQ9X30fleOVz+fl9ZqxY9p0Jfro4TQWzi2mzqW5'+
                                        'E4UHIub7Rf94mdeHMasrVgAO2LteBTDfkfw9YHX4HnNI3a3cc5GU75/33Df4RIxnYERKcOaIQSj0'+
                                        'ZfCfaI1pEHA1g0InpADCT1FLoDhuXDO5NTgo/C2wcFJJITKA04fvqIE/WOyqA789B6abcdQ5wdsT'+
                                        'C0HqzfNi7M1Fd+zQdKb1oTG/9peu36kJOFe8ZnvsuFAKgP8xjQChC4grgYR/Eb6WbJiWCxDPAgVA'+
                                        'VxL/HoqSAotvpCr3XqDlfz/XS/0IfDqdY5zkmLLIJcDpTqAGqgiS3l5k0trTLBoIf50pjqRBRIXY'+
                                        'mqNkKksBFYQmcJwsAzKkAPJzruIbLnwOUOr5x/z884tu7he2pFt/WPEWP0J40BCoBEYBqBKviX6M'+
                                        '9JT/j85DElQRRUDcZrK0H/vFGijWtaMAOAAgePTz7Uxl7wVn8tdmPffNcDmZvMPl9bVR6F1l9Sjc'+
                                        'coqRHQUleBxwHJRgg/NaQoeAeCsB/JdKlGzJMnKxzcmlDidtUAjkIuge8nAPp0c8iEaOi8IHik7u'+
                                        'HV6X/+Y+l3/SAZEiggVSeEYBRChT+Tua8HEd4sqIInzerwTIN/BNSi+PBjZMAfBYD4dA4cvvQJIl'+
                                        'AuJliqnF1MQ7z/mFX/V8Mi0FD1dUB0vr+kL6Y2D5YGWU3Fh2yDQMvBG8x8lVv5mQLQujuLfEyCSg'+
                                        'wpkGB1QISNunpO0gYgjJQfBaALluf7TGPjHTZW/cXwjePel632IUldtVLsAEjdT2/VoJdMjLpWu8'+
                                        'XAnUa1QbUxQNXLMKECKA1wPsTJFmdupfnXUm37vUoy/KMfSrhLTAYbfBufe4CpXwYrfkGdlTZlIJ'+
                                        'OFe+/5m+GdSB0JAcqAIitSk5WQ9IE068ByjQgQ+g60BXhagw0xY/fKnjfN9NRfq+fbnu+xjhDWoj'+
                                        'toX9oRLo5NBlSqFfN5/tixw2MgxE9u77/pAhXHIY2Kwtkgu1dm4pv/03zovSz4N/pCj4boBsW1k8'+
                                        'Jnc8uJo0fH5vxSHb8iy8wGvxRnVyCSOG48sBxPdchZ3g1FNMcYSiq2LPNuD/ZFo8vC0nfq5D3K9I'+
                                        'khgL8Ux2UIWp2gXYIaGIwkQeUwAZBu7OkNIKYeAVK8D8/PwVK4BJ+Z7tsLuPtrN/shy431Vg6gKQ'+
                                        'WHV85eMDKXxlOQfGXFLJ0PCir/lJFqZyCqdACc40AvncxawlU0QVo5QCKAIqOcB/e1uBvAeU/3cZ'+
                                        '8KBARP7eju/DHIAQffkC+3Ue+5uX7MqR4kYowOzsLPE8b80KgPaLDPekX/rxJxrpPwIcn8xKuBfS'+
                                        'anqBErwhdFXAzueMu9KP+s+yiUszX3Ea3MHTy4FOXavkD4aoWSAwmKRBgocoN52jHz+Qrv9sVvTm'+
                                        'A0LXmSlVt6mpSZl42jAOMKwCyLw7aHeLpskpv/AfjzWcX88wZRmLwJwhZJJ+PtDwhsIfk8J3ZIzd'+
                                        '48++aWuukzs7i0wy/OM1JL3q2lDAPjzxwA1gIisHx8W2+PGuX7xlX67z5gpvfEuIkejAxpBAZPBr'+
                                        'cQEY9rRYNvdEt/wnF1riJ/OOkALHZEpXkznD59DSEe4R9iHSk597tt4MFG+HeBBdwvGaTxjmL6iQ'+
                                        'UK/cHCVFVARAg5pH7/oWz33+5ix98zhf/KIQlKzn6ldD+HUpAB7DKIAWfvlwp/Kx2Tb/gbyL7F6Q'+
                                        'ek+lbwMRhTN4jwz/QNWVzDng5Fl/M6RsByBBN3CkS2CWz8b5ioBTqQjo8ryAb3uynf2/N2Urb54I'+
                                        'Fv6Wr1MJnlEFYCh8Jzv+RHfsL+e64mVo+XWw+gaGd4GCQ3v6FL/uxkpKhoHedVathJezC5SgDsxv'+
                                        'vhOoWgpN5jgIH5UA0Q6VAF4pHGnnPnFzpvqTY735jwdX6As2DAFMFm8lBUBG23FzhSe9iU/MdcTL'+
                                        'UKg1CIuQ6XuGsVp+DiFxd9mVmT3vOq1UQ9HuLTukAUqA+QEWZvKEJr9UIsJYluHcRvpot/DR/WnR'+
                                        'qXRm/5YPPcVzDSAAFQHpuXn3GJ/68KWWeDla/hKQvaaG/bDwQU/HBtLvq9RuoMOc6/GG1425gJ1F'+
                                        'hzy16Kk5fCuZJGN8rjJ6qAQpwVPHeoWP7M+I1xVaF/+fEDSqinmmOcAgEkgxzZvOk1Ns6wcuNPiP'+
                                        'ouUvdQPQepXcCYSF9yZohcc4KBgiyVIDSq7bG4frm8pRcqlFyQKEPw7rfw9TuipDLsg4KAHjfvkk'+
                                        'KX1ib46/MlO/8KgY4eCsWwEum8vXxRMXnKnfPNcQ92co+nwujy7XGm6mvfTkhS9TvI5k/l6whpmM'+
                                        'Z/EN/f/2gkMWQQF4rLYG3UEXCTFRE2UTYEHtnrflDKv8ze5U4+WsNX8S6yOuCQSIKwA+WyjufMup'+
                                        'pvOuNFH58GUUfhClKlXFpojyA3BsLagiiWCTlKkj/8EkENYvzLWCvuJaM+MnQ0DMtcDz8RyQx453'+
                                        '44XM1Ee3pNqvFJ1Gi1D2zCpAfC6fcp+0Kjfcc8Irf4BwT5KcGrDdrk7tilhBpyKTRGo4pka9YHOt'+
                                        'UXCYAFfAyGzLv3waW+f+ueYD+Gwcxmm2Q1+UKe1+f6n75P3c64EOrK+yf3QIgEUc+Ur5bFD5cK/b'+
                                        'K6EaI7yZvL5dpCCERQFAKyawykNHBZvpBjyZlFJMprmRH8UrrKO8v7IeRMqqrD1w3p4ubvuqs3Di'+
                                        'I2KF6dBhyvauWAFQ+KECgPBpKkMW8nt+e64e3JmCU18EWGvrcE8YyYcEVk1Wo3ZnUjjZw2T8uxkX'+
                                        'KeHkUCXNSA2LGQdwOzPPX4Nxw4nEXJqQmez4+7ZXOl/zZ44fIU76iuB/ZAiAeSpvYtdrzjfEO12B'+
                                        'NXrg+71AJno4ieqYqK53D78DWa7ryKIOn5NNecMpYEQBHMOBCGjCYkCBRaLKzert3sRSfvoPi/n5'+
                                        'V3v1xYAw55lAAExp9ohTma5eFNXf970u8cGZ1dHvB1ylcQ3h40KFjLpihWpCgFOVkvTwzblGEYcB'+
                                        '8wKY/MMZ0UELbWTGlKtVAjh5NgF/NNthr8hVd70tWJr7oEgYvw1VAMwE+n6PpFIpspzb/q7FpncT'+
                                        'hZNYavuk43FVwYPy1xwhrFuk/QsXcCo4kEWSZJNCgBqPNIQBdVUcsNJHYWzV+gisgC7BC3Nu8b3j'+
                                        '5cm/78xfPEMd5+q5AESAoNclzvT+u2Z46Wdo0JGW3wbcRzYfGLcv9Oo3KXxd2Sr1WJAMYBlWyfgB'+
                                        'J5t5kTLygKwscVtZAczSsTY8qhFfFp8ut4PJytTN7yZLc29DBLZDww1FgMDziHAyZDkz/RutRicb'+
                                        'gDuod30I+bie4NF+n1uZSxotaUKLd6maDAgCQTb1InWBaxiEhHg+zFpLGLMWQbTFCEqQeS/7lonx'+
                                        'HR/qnPn2QeqkrhIHAG3j1V0vm+04rxeBB5roK+uXF4GrdFU2Q1IAaqV9Va5YKgDVSBAIsqkVQOgq'+
                                        'KVVgM5TXkOFznfqSP9B2L1Wq7Px1euHEa71uO0SBjXMBeKLpHK3ntv5qp9Ml3Z5PmmD9Evo11AtG'+
                                        'Q20VZskLIaEiqIyfI9MHwSZvUmESZJgmp2JYBRBgcEC4cVUSjO9SkH11deqGl7ROPP4l5qY2GAHg'+
                                        'LJ2pPd+72HS+l/sehCQA/RD2YSgn5S/VWeW05YIPbshfpAhCL7KXK275Ju9SoleniiHHIVw3KHCe'+
                                        'JZAFNA7rssrYrl9w0k99qQcoQCnbOATwOCO11NTPtrsN4gHjb/Uw5udqJS7mBTBcYaqokcrJH3rZ'+
                                        '4v9AruXn+vgOAshxEHz4eT5dS9HuEbKsl6Mt8/z3Fbfuvbdx5OGHnFR64xDg2Fz7rlPzrVch3tfb'+
                                        'HumAC1B1e2rZgpDLvEiU+bM7PlgExUPC6G/iENBCABwL7ou1TPVLJOiJgDQ7QApTjLitbqo6tfen'+
                                        'U6ePvLXTbMgQfOQKIKQCtN7S6XqZHsStra5KCAUignlKjd9XGkDNemfr6lDofgDIoWe7NrMO4BqJ'+
                                        'rh8MTQLjGUJMudc7nqyebtLiD2VK4/9heXH+HHNWF++aFaDW9qtPz3d+DP12swvW72Hcz9X6dcbh'+
                                        'fxYViVCulz7r/huC2+cOf6s032FkU+cBkLW3ZfKMr9pyJw4dHMYevADIIiCltEuWW97YxJY9Pxwc'+
                                        'f+KPzIqhkSrAqYX2yxeb3Z0+CL7V8UlPkr/I5wfUpHypikbwcWClvKxbVy76DGRCiG9iDUCy3AYk'+
                                        'XS0RlAjHRC2dw7xAM81IHlxBkBv716l88Y9bjWU+UgVAIR2fbf1oD0gfQr/0/YFK/FC9gNksaJGw'+
                                        'H+hkkHk9di5IBDF8TLHUpo0EcFg8osaBc7H2UjjkUjqP0ACDLIISdIule7KVqdtr87OPjVQB6p1g'+
                                        '66m51ksRdtoA/2j9Mo9PdGs3zfooVRM8ctkPN/N/NEGhcFYLocvZtAiAANkDJGz1VLeLtU+KqvH1'+
                                        'fCEjgq7ngCJ46er2fa89d+TRx0bKAU7Mte5bbntTOA8gFQDgG1fvqtCPawJIFQEkVK3qYEYxkmar'+
                                        'IHQBIjBZcNbU2ep6ujkwXjgGOJZXtNBaLz3CSmLsaYdIUuz2yFhp8hXZUuU/8WDlFZVDKwD6ebD+'+
                                        'VyHst4FwdEFjMf+v1r+h0IVyA6Y5gdWlUaxwYcgjkMAUUmxThoM4NktYEhaINRLAWDSATbJ8RQY7'+
                                        'aJzF4l3Fia27eRA8PRIF6Hg8e3qh9SIRwr8v5/5lzE+iJQtUJ33kNLCg/d0eE3kFIYvNHsmWM5vO'+
                                        'DeCwdIH91zs9VQMorlwBJBcAlO30IKT0XIwqKtXtN34XIMBoFGC+2buh2fH3dz0kf57MABr2b/y/'+
                                        'JBxMdTiiAdd8YGUFEFoBqjlHNlHYTCqA8f8CXDum0RldR62/zgegTDoOTskjSvdIPlN8USZf/PhI'+
                                        'FODMfOvuRruX80ABul1VD6hS/CwigOgGZBUr0zOAGhFWobZYPbzQ6JLJYnrTuAEcEVwhtVDvydJv'+
                                        'vs6uqWh8Poy1hw02eg5pt7sks2Xrc0vVcawSCdalALISpee/AGEfZ/48jP2xwZNm/0QrQIgFVDa+'+
                                        'UggQEgKyohuYb/RIIa1RQFzXC4N07oeSORA+cirGKFlXRYRpGQP/KTfgS1LZ6nQPeH4wlXbci+tS'+
                                        'AJznP36pcUsAsN4FkuH5Kv5X/l+1d5OJH5Q6I+HzKAcghvgNIgdkupTu67B9vUJ/B8ZxHlBPLobh'+
                                        '629oKLQi9EAJOjg55yO38CdOL7RvuGVbaX0KAOdbgC/dgzl/5ABy4gIVgBm7ZySq9zWRgDCOgQxb'+
                                        '5bDQ7JIsRAOF9PUdEQRwsZeWu1JIbBTxrzEYbLRB1LwC8goZqXFxO7xzcF0K0Or6E+2uvxOhX7J/'+
                                        'nPwJhAX8Qv9rFMZ2DIQMs4RJrhCGkPVSrUO2VbOhK7jOgj45NkstD3P20i5GouiChwogW89g7wU0'+
                                        'VHDTza5/QKzghYdSgOOXmtONTq+EsI9KIBs8SqejKKAUP9UdG4nuG0RVUYhSgOHzW5hinl3ukGkI'+
                                        'C8l1NkuI0N/A66t3wm7go9ErEboAdCeeRgB8fHaxtfu5N1RJ2mXrIIFC7MIv9Yz16yIOKhxi2hVK'+
                                        '+2eaCxgFGCIMTLotQWiEfzKev374AEI9LpObAYRDQ6KjZLmWC0Aa5gdUumlPIjWfpnRwonUoBeBc'+
                                        'bPX1FyL7DzOAYcUH75sLEEYBMEV8BZ2u8E/m611ZIlXOpcizfWMrtD1shIV+v6v9/kgvKVQAVVsh'+
                                        'w0E0WCy4CcQEvJMlatubK1MAEP4Efpm0fvmlXFb+Yp9bme8hjswGytU+KHSDNkEQKcMVMNt5gEok'+
                                        'm+Wc+6zlA3jpmOeYqyvhj8zvJ2QCFR0AN8AUD0CkBrlV4K31KUAgRKXe6skcgOwPqBVATvjJDlaB'+
                                        'igSojgaE7ndOKKHr6HeIXzMHoZLHuUSCWFf0Z4Xwex6XOY7eRlh+XyZQhGOPLkDyNfhNiAiK8EZ6'+
                                        'XVEAFzyP+f/5WhuEj6VLgATY456YSi9HrRBmes1PCAEi4gNXHuKShUZHhjTVQkquornWQ0RDe3Ci'+
                                        'axHYPiKm7PS9UedtFX9iQS5nylXXGrhWk+OOae76MoGcZAT802hD7IoFHCktehpteyYLEOWHtdUL'+
                                        'GqWC6Xrbngr47Z4MbapADDMp1rdL17UmeJwjqYPwsUCD6BB54ya6RKQAQvVnEpyRJUAdrLQCl4DW'+
                                        '76xPAYRwTInxYr1NsmmHFPJZIuxZQNPsCWcBaaCzgloJhkgHD5eRVOsPilmXFNKuTqGSZ14TrK3u'+
                                        'MAmDq6SQhBGzC8hGnqDx/bprNI5IrelD2EfJlmpG7rZEVugq5Q55gb4NNQvgCpDcFfOZsM6zr/Jb'+
                                        'hn+BnBCgRkgjinuwjKwGfAThtZBxSDblRBVIz4AmmKQXFsa2cBauJ5u6R6uiNjy3FCkAGmGj0yMd'+
                                        'QOnpSkYjAtaMivVNBuE2PUwYS8c6fi6VAC8+l0tHOm52taK6MpjaeYHRXncv8KVLSLkOyQEiIdyZ'+
                                        'KVVxdYxe/g76WqyMxvkSubRLw8FVU0UdAeD5NDseWQS/jyuNqQhdkh8WbFyxAlDSYCzaWJHp7V4W'+
                                        'lttkDJUgm1Yl30yrCyaEqG4JYiWFNuLWlW7Bl6njbMolaVwgweiGlJiZ75Rb1CDD9tSKKM6jBR3i'+
                                        'aqcvtfAxg7rUxMklLC1zpSgQ+3HDEhgNf10K4Dis5uptLdXEpbJsjAgW6i1ShZOQShDuc2nqAVi0'+
                                        'gS/dwN7nQs2td/0uYXC5KThXPFy5kSQzESmJw4NIEPBlT8wOHFx1N5cZNr0Mru+KngEeYmZfsKS8'+
                                        '1gLhY4bRhOFUb3bp0AYC5roUACxqDgfU0Q2eFOHjcoky8Skwzo7q8o3uQPoiHq0IovZCkY2f5ceZ'+
                                        'Ngy7OsIkI9UuHfKQySuqeKppWhULOYWIunhLoQuV7OKxLib0mZN73/lieI7L84TefMsYIdL+lNym'+
                                        'hi3BJbfXpQBwsefRxzpm500UvoQ9pncv4mS51ZEELQ9KYJJCZiIorAqiV3e4VO8hrLu/PFSLZir7'+
                                        'JSksGBeD0OEZFrxptYREuAUKoNyA0ERQuWq0fmm0Dp2Dl7rrUoCUy84i2zYowMzIyp0PtGzhvgWx'+
                                        'OkJjEZSAOUKWhhFdJk717OCVl76OxmKEGF6ENmBdSzkHnIpvdnSoaZouKshSqAfPpfUDGQTDvbgi'+
                                        'ug/zgzdvr86V8+lF+MIxxsz+tUL6HBJNA0nwwZJkzEHncxk4AaOuFgkU13ux18bmGrAJB8K+nFE0'+
                                        '8b/QvQWEKtJzlO+XG2XfMFV8etBU8PAkkNH5fNY9nUk5Y07Y+UPv8aIZPtdZPyoZMiF1YKS5LLJy'+
                                        'N+oURvWud/Q7SrDWXAMKuC3n+bnqH2wJPzwQlR2lACj8XBrG32FPrhsBsIStWsicyKbdu9ANMKqI'+
                                        'ngibP/TP+xvxtjpCamomlSIOpiXDrNFV2A3pOrJ8rgXvacFTIfpyAKHw5da7ajdV5GzFbEqAEhxe'+
                                        'twKgJu3bWjmcTad+CBMvEgXkRoVCbgwR9iyRtQC6I6iuBvI85bNSwCHS8Ldqwch3FGAYwQudb+gF'+
                                        'QbS4WsT2jheW/5etZKnsOVgBHjZWzFzYPVU6t24FkB902cFyIU0yaQeZpe4CptakhZM9disYprVA'+
                                        'qP533Z5CA1QCR+cUvnMblG4iMpTFKeS+FcPWlqKCRNavXIFCBySAYPlkrJQh+UzqKLw0PxIFOLBj'+
                                        '7Fvj5Vw9l0mV0A3Ic9I1gEYBRF9cbVrG0LA2AIs+26DNrkzSMJmk2fTtQfrSjGobOT+w+ibZ7fWS'+
                                        'oN9GAEplVfV0NUfGykVy8vBD3zi1nYsDz7ll/QpQyLpnxorZb5dyqfvSrlrA4et8QNgIVAOBgf+o'+
                                        'MNxKB+MatsCTa9rRlbiOChE36+rgaLt4LXihK62pLrChsd66VgFo6Pt1xzU3Rcl0JUdKgAA4UXdq'+
                                        '5syXGvX9ZCQIUMim/P3bq1/8xrcz92Uyrs636xZveoEIoSSGAjphaZpGSdDA1atd+KAPihLIeQqm'+
                                        's3RmneFVj61IDGKvZl6Cq0pergk1Ftdgb59sJkewAzjm9e2oKc78JRHHcYT7yRJYfiEDpNshWYfP'+
                                        'ZNKZQ5Nbd4xGATCFCgrwhYlK/pfz2TRwAkciO8b8IqDWYFLtoyxh6gohz/fI9vEs+eW3vVhClYoK'+
                                        'or3jZBLjKoaIQk9qyQwabuzsOFe8G/qV/j63N9DSY3X8/CJ5/98cIsJJEyy2khVXprKgTwFUSIgl'+
                                        'ehPFDBlH4acdSdoLaffhV7z+TTOTW6ZGowB42z1dfmjbZOlUqZDdnYEfaYEPx+JD2RqaR5Cv1glw'+
                                        'bf3wDAcZnvm9DhnL5clbX3W34g6cX26FKxCjxJzsUPlZkfyS3PvQl9Yn5wgcJ9qCZV2rdQedTJKj'+
                                        's/bRkbWUKfLY8XPkfZ/8khS2Q01hDQurfhS51r2FA1UvOVHKkjRYfh7QuQjPS/nUp1vtJrw/TlYo'+
                                        'CFqbApTz6dqBneOffeTIuftz4GeWHd3tNxBa6DT0/7JdrM0LMGgE38+9LllabpL60oKcS48nPAYl'+
                                        'QvqSImssrxr0+WG+d9A5DdOEcbXfTPrO8UqJNNsdgMuWEhwoBMKAsPeEl7/N5WxsKesC9Gdk6Ieo'+
                                        'itZfLWXrwNMeiI/vuhUAb7feMPHX02PF+88CyVhKuaTX6clVqfGSA2F7BPkA94n1CW4mhVZXq9VC'+
                                        'BVhpIBP3JVyDdQ6jVKspT9L5Gbdh7gcp1WpKad8ri1c+XQSgBDQLOgBcKXBJWIGriR9CvxJ+Vm4j'+
                                        'g5m/QiaFXA3i/+xX4LtODlOEumYF2DFV+vKebdUnTpyZvXVufpm0Wkz1CgirjkQEOcKggFo8Iriv'+
                                        'DlzF2uuRYTR0vVa1GgoM816SUJPQw7wW/z4R7oTaL/T43yGhxtVXMsoHtBTMJ0xOunG9j5yCfy6F'+
                                        'nwbYz0iFwWgKiV8eoL8MPKCSz/w5D5SLWA2k1qwA1UKms3/H2F88Plb8rQszGdJotIjXU/PlugzA'+
                                        'cgMkmvxBBUEuANqN+wyVSkUZ9gzrVIdHW9EXMoehtFg13d1HMPoFHIXfNLa/X9Lv2a/Z30tNyly7'+
                                        'y36FUopRqZTJxeai2j7VCRRR1pM8RNclVPJK+KYaCPMyEKZj4odMlHNngZ8/ILnZRjWLvn3P1McO'+
                                        'Tld+8cyF+UptuUG67a5m07yPc4lQBzQC6LyBC2HOxMSEzHYNG3jFL+Zyo6drEvBaFWmQEsXRZ5DA'+
                                        'w/fESgRTkHKxQOiFJStORBKNIaJi2ePFtAz1TOGNKoVzNPEDxajkPwZDvDgsR7kiBdi/fezpW/dM'+
                                        'ffL4mdmfmpuvkXajDdClpoGFxXVNkk8x6yBcu+bKenVXlo8PI8Bk2dFVFCKSY3hOidAsolb2umIo'+
                                        'IubUShdYr9voMMLMheQAjk6VE4eYdWS4hSym38G6wfpT0v8LrhabpNH6gfkXwCVMVfINePwhVa4W'+
                                        'rRYauQJg4maslPtve7aP/5sLl5ZS9eUW6YJP5z2V3OlTgrBvnEoN454Cy60u+CyXqE2OhrD/RA0Q'+
                                        'a4oA4+9j6NfFzS66XVnljAOfyWTkkVRdLIb6sfUnprC2rw4Hsn+s7UEil4Fzm6zmJcRzHoTNN3Ha'+
                                        'F31/ESy/BKR8y3jxr7CZK3KJsEJsIxBA5/ceuWFL9ZOnpis/sbAAZBBCF99TrWOiOFgfQhWHYgr5'+
                                        '5PlFcs9P/CahHFgu78FJWlXLlA4W+EblZ6zaffpM1CkI67cx4cPSxCdpGLK0zAJKy64WSMp1VRSl'+
                                        'y74cOZ6M5GXaV36mXcql/gu6VYkQ1mqhDVEAhPtqMfs7+3ZOvuHizFKm2UQyCNaEm0SLQOYGqMV+'+
                                        'qS4YCYDNztV0+bKJEggz6cYwcZDoL6+3QpK4iVIN+zAcqXSWjJfLZLxS0OV0gSKDQm0b54JbxRVa'+
                                        'FeAD5UKWbJss/gV84DDX3ULEkB0o3PX4Kzibx/dsG/vw6W3j71isNUgHyaCHwg8u97eM6ipxB7QZ'+
                                        '4luaIaqbiKkYY9b6ARrzu3QlMvBslb5lncoMzGZQmVSaTI6Vgdhl1Rojrqt9uUqdO9r3Y+1lUUH/'+
                                        'cjmf+W2f87CqWQzZeNK98gugstAD4s7fumn31I/MzNWmmjIk7MkMVWAmKYixcpXNkm3ljabrKiKp'+
                                        '4czp6yxC4vG2vfccffbLvp+cCL24hGIMD5afBwE7JCwFEJFbldYPws8B8asUc4DCObJjsvz7IPQT'+
                                        'BvaFqRcYovmcux70EmrDp7O7t46999yuyf8qUQBIlUwMeb5OWQubPerKYKY3knDkUnIleKZnw1if'+
                                        'EggSW2UsLE4QLce5tm/UHjQSLZbRAkPhZzOMjJdy0qplxwVudhCLyr2RK2GEgNBfBsEj8dsxXTmS'+
                                        'y6TejxXCkeVfBQQQekIiACvPpJ3/fsveLW+cnV/+nmYTQsJuT7aRCSRkcRkBCrN0mbGwnZxsMI0h'+
                                        'iy4rVyXkCSt0hOlDRvtzzRvOEEfs64U1GcSJnoRCwadJFfw4pnOFCaWF2XVV6E7sCvozCP1ADKsl'+
                                        '4AjVIpkeK/yCHwTLcm7AWL91vyFhYBzJgHn2pseKP3fLvq3/vFRr5rudDnABn3SA5XMRxSOCGGKo'+
                                        'ly+FCsGUEjDVWlwwFrkGqgqdsMRMCGq5BLsNubg2XYNICCb1iiO8DIzf0epxcaua3dMCt6Z7TcJH'+
                                        'LvRA1g+hYKUMSJHPklt3j//PXRPZT52aa4eTiX3C31gOcFm+/Bv7d029e26x+XuIAj1cH4CbQuEW'+
                                        'sxKPtAqE6wvNOkKtEEwriNVvPnIPahdS+ZppPGGqT+OL+K6VSCHOwIUq+sBzRAgfAwvG2j15tVwX'+
                                        'fYaZVN13QSuAWujB5OJXFH6pAH5/S/XI7burvxjo8jG175LoU7phFqdfsQIwSsNIXyZ6QXtz6dT7'+
                                        '79i//WW15eb3h1wALk7mpbn2AyxCgBAJqLBchMq5mmVnYdk5sbkBCblBGDISSi7L3V5LgsfNskGA'+
                                        '1WJGQrgUGOdhcWdU8asLPPXEjyF9WOhRKWYl8ZueKPdeeuf2d964pTh/9EJDIgoLbUD0d08ZZR7g'+
                                        'f33uUfLE05cIFoPsmKjIpdiGoMq9ocAZTZTzb7vrwM6vNJqdPb2eBxGBT9qtrlICESmB3dqEUnOm'+
                                        'TCWN5KJSrhNIRvDxpeaU9O9OkTRTQwdQBDoKbE94Ki4TvNwaHsYLJ3BKQPBUB1RVQ2H+hhq4J1Gb'+
                                        'FzUBpGb6MOGDkF8tF8gE+P1928ff1ekFXzx8ui77AaCSYHU2v6xkfMQu4M8e+Cb5xy9+C50X+Z2f'+
                                        '+X6ya7okS5ft3wSff/6GreM/2XjODZ/tdHs5zA7KvsJCtZeTSBDCvhKyYFyHiUJvMc9Voym5AxmX'+
                                        'UUO0AIVZGcOoGjk5dxAbCDriNb0D6gRMhRFW55RB8DhP7zpqdY9axasFH5bDiTDDZ9b5yRp/FL5M'+
                                        '9UJoWMmTsUqB3LZv619AzP97py41w4aTEo21JQpr9nTkqWAMUYgkIJmoP0/cEBCOGP3nO/Zvux9c'+
                                        'wEe9nlIA1OhOpxcpAdWkjolwwwO1rJxF+w0wrQhmzpypErNwOtVWBJ1REiE5tCZ5LjPVESGAVanL'+
                                        '9ehjmIZVuRii5WQfI60UgbC6KVvCFv2PzUpfFCqSvgKM+XilKCuFbtwx+aUHD5/96T1bK+SG6Qpw'+
                                        'iZRsDc+5DftrK7N3R+0CXV0yfuLi0p9PTZQn771j7+/LvQWweJHXSbfb04jgK2HLbCDTWssiVKA6'+
                                        'V6DLo1VlMVOugVqIYCFB38IU/bqwYb8vUBhyrkEMmCYmEeNG2pLFQkzMy8MhV0DpUFkExtpJJPCo'+
                                        'v3vE+IkhfHItphZ+RgofLX//7qlHPnvw2Bs/8+DRegbixefsniSvfsFN4s59W+UqYOwLRBKWtV81'+
                                        'BZBLxgDmTp5fIp8/dIw+ePiMGCvl3v+O1907cd8de3/ta1zXCywLWUaGWUTFCcxyMhFav4J+EVq0'+
                                        'QgNds0dpuBtJqAg6yUTtIsSkySUzOJSu4MdXy95GQk/rsAwnZFABHP29JpwLrT20+miSTD3mYZUP'+
                                        '1XxBCh9QBPssTFQLMtbff8P0sc8dPPGGv//a0Uvwe3Ky8vDJS+KJk7P01j3T5FUv2C/u2LdF/j4i'+
                                        'Ark6CqBgPe2qNiwnLiyC4E/QQ0+ek8uXAZ7YXK3FP/iph9719tfcM/H8O258xyHtlOqkIadiuZ7X'+
                                        'FrKANGpBI4tHZH7AZAiZhn0Woobcl4jyvtUoESrEFSCWNKJrI4RhF07MwWNTKhA6pmIxLHMdGibG'+
                                        'olVcIszuUwuWVYLHniU1iKCXdcE1Yw9GFD4KfqxaIvt2TV78wsMnfuwzX3vqOPyua3KhmZQS3WEg'+
                                        '5XjctmeKvPK+feLOG7dIQ8RNI8hGhoEqnnXJsXOL5LNfP0YPHjkvewNAhEBxgNRJOu7sUpN/6NMP'+
                                        '/+xbX/1c9oK79r/9EAziBdwrD95HJQhEEHYcUbyAh8vIQzRgNhroBlSCWsSwPzoQluBp0jwCHxwm'+
                                        'ilhKAWfd0hCC4bVmQehmbaPpyMG57dv7psv7F3Pafj/u77Xw8bsLuSwZHwOfP1Yme3dOnv/CN59+'+
                                        'wwNfP/ZNGNMs7ZtjVweMsTxVRITDT8/S28A1vPK+/eLu/Vtkd9UNUwC0gCOn58nvfvyrtIa9ADKR'+
                                        '4LVZSbMFTXVQCf70M99857991d2d777n5p879Nhxch4suLZUB2LYkfkCopFAWbyqIVBQryCVMgsN'+
                                        'qLUngcUHZHMqRoi9b72IcYJBLt5seYcxN1ohWhgWW6Sllat+h0Y7hGwC2e9dzJLt/rWRImqdF/f7'+
                                        'xJA9IhEUQ8ViIQv+vkQmxstk57bxU59/6OSb/uEbJ74O41rW/VW4Jfy+x2h4QiLCrHgcXMNbXnmn'+
                                        'eNXz922MAsjCjotL5COfe5RijxogP3afyFD4+p6hEizUWsGffubhX/qxl9y68OJ7D7z70GMuPXXW'+
                                        'IUsLy6TTViVlis36ekRtYTOdARQh7IswP8AtFFB5ibA7Gem3fFOhZA5HL1BFwoXhFvIYPNAaHXsv'+
                                        'l5DMWR1uRHSxUVhH+v2+EH3Cj8I+tYqXybWRDqAmRA2lHMT5RbJlqkqK5cIj/+dfjrz94LfPH8ml'+
                                        'U1N6+21uHYEeW/Nc4hpeIioC7hj9kc8/RhEdfvAlt41YATSz/vRXj9JlsPy0cYKWwK3Hjj4YDHAW'+
                                        'S8H+7LOP/gFo5vz3PO/Ab5UK2fKJUxfJwnyNNJpN0tOTSGpSw8wg4ZUxeXm0T/D9M4eqD1HUoFIK'+
                                        'GVvEYWMrppZ9IZw7GKWY1cm6uSSjzAIHveQqENZ+CGZHdKJ5yuX5BGqhgHmdXoYAIlQa9NOyyWUm'+
                                        'Q8oQ41eA6W+dGicBZZ//yGcf+5XTl2qXAFWntLDx8K3HjvWYxl6DoaAUIjHx6Qefov/5p32RTrmj'+
                                        'RQDckuzpmZot/LjgjfBd+wB264CVl//uq0f+dnZ518UX337DeyeqxQNHT5wn86AE9boihzJ5ZMqa'+
                                        'zNZjlPVZOmXGkh1plkrQjiV0pg+tGPrzjFkho+5fIGjkCKIyBTuXYHHHWKaZCgsORL/wqU0gzeAw'+
                                        'IpUxnYLoASC/UiqQKgp/ekycnmv9j089ePSDS41OAJxjWgvdPoLYcyN8zcqJ2cKFo2zOXqqJT/7T'+
                                        'YfpTr33eQDZI17K86Qd/5WPk7/7lSUwIJUF+XPCyVZ0+XOuxPIClerumy1t/4AX7/l2G8VceOX6B'+
                                        'XJyZJ8vLDdJpGZfAw/QmCpZSY+WRQPuVoX8W0b4PD43j0U7ntuCt2gPSrwgGASjt9/U0xiYi8he5'+
                                        'Al3lJV2Oiyt3wepLOJ9fKoK/L5FiMT/ztScvfvDLj5/6J4qpf0fmylHAniVsb8ARR4eQK/QgJNy3'+
                                        'a0Ic/ND9ophL3jLAec973jO0Anz8Hx8H4jeH/tLuvclicG8sHn8xo++z+siZAyC4Umt0yOMn575e'+
                                        'KuQW77xp24FcNp0NhLXbqEWWbBLVH2OLaAdtiyDTUBix79CPqZWUoTEfTW2ippM0fc+tXL15TnUs'+
                                        'HzbKDEmeyudji5xMJg1CL8jwbrxaJtu3jpO2Tw7+zVee+uNHjl18KuU4FUCoTMxYXGts4xxrxbQV'+
                                        'Ktx5QOq9O8bo8w5sH5kLiFdi0ASfbxTAKEH8kO+BD0xzwZ3PPXTiwSNnF868+Padr3/eHfu++9TZ'+
                                        'WXbx0gJZrjVIC9Ggh9xAu4WwoIKHUQB2JqdhrkD3GTDlZ0ahtJ+nNjIQYqEEiT4bTjnHmH7oJiIr'+
                                        'p7F5AavSTRJMBfcQQubQ6gtg7Tlp9Y6bvvTVIzMPHHry/EM9z+cA+dsti45bObZ67VrG1SUJTU6t'+
                                        'I6w5guiC/sEnHxRvevmdJAkF1psJTHIBNtzb1m8foRIAYUkBW02dnlny/vfc8l/ffeOWo/fdvOUV'+
                                        'W6cqO86cmyNzC0AQG025F65SBJVRNHVvlASWwHR3DR7VEBg06aspEqYZhfXcShWHO6Dbc0hmI4wB'+
                                        'k0A2dzCCT6HgsxkI73KkUFRtW0ABesdnGoe+/K1jX7202KzBtU+AIfCYf48Lv2MhAbNmuuyQkFvv'+
                                        'hacOCiCeOD5DPvYPj9G3v+5eMSoFGIQCcQQwFm/DfzaOBKgsMAgujKt76OiFs0+dW/jEC2/b+byb'+
                                        '9u987vb6ePk8oMHiYp1g6Xm70yEeFpv4NlEk0fo507hSC1k9NmhgcQJO+ucPQpYfKzej1rYoNgG0'+
                                        'Zp8l2TRhpat6I2azaZLPgeBB+OUysPxSniy0/JOfOvj0oSNn5s8B1KfA6m2WH8R8fk8fcRdgpWL7'+
                                        'hB9YSiD6zhjC63Ozy2IULmCQ4Aex//QARTBIECoAfh7zMNmU4zY7Hv37g8cf2zpePH3vTVtv3X/j'+
                                        'zgOddrs4M7tElpZAEcAtGETAJJJclxjYHMCEc7o1DaMhGoRKYnGNqJk5DYuMqLDcArHcg7Zy1XQa'+
                                        'BO8oa8dJsDTE82jx2CU1h/P34O9RARZa3rl/ePTcE0+cnjvn+UEAHGrMElpgPbYVwCCpsXoSE7j9'+
                                        'OS9m/bTPDQD0/9WXnqC/8daXiVG7AJKQA3AS+EDKEnY6phjmvTBcBNIE4+rIDOJnDh57fKpSOHXn'+
                                        '3qk9N+2YvnHX9snqAqDBQg0UodEmHbm8q0dw2hn7Dkhl0GvjLqvJCxMzNGpuK0h/ZREN90BX/7GI'+
                                        'KyDPUDkFJruJ4GodhHkkdxkQPLbMx610ymDtbirtXai1L/zzw2eOHzu/MNv1QPAuy0N4JmJs3UYA'+
                                        'FhM4jX3O12PlWePFEo6g3z1RutRoi1GRwKEqxhIOJyFSuCxXYH/OlX3kCFtYbnlf+ObTRw8eyZy+'+
                                        'eef49M07Krtumqhs9XpeCkvRG802kMWOTCRhDaJaohaoaWcTSvat0Y/6l4mwnCDiASZ3EOYRpE/H'+
                                        '7KCydBR6GoUOsXwGhJ6Tfj4Lr2VEx+fLR2bq5544ffr8+bn6MmY3Uy5L65y9sDN31mOaQOrM+/Gx'+
                                        'YitY+8Cbwxi5mgogYvHaahOuKyYjYPDR4Fi75/GHjl44/8iJmYtbqoXi3q2Vqb1bylt3T4yNE+5n'+
                                        'WuAWms0OaXe7sigVt7mX5elBoDa75DzkDX2tw2m0rY0ReihwGbu7IHh1pOWkUBqOlBQ8dRze46Rx'+
                                        'er556eTM7KVTM8tgbL0eoBi8xVBfjL9e83WP4PNXtSBEDGCmPCGdafwXi8W08b93bATBFCcWQ6D4'+
                                        'Li406ufm6rWvP+mcnChnczsmS+O7Jovj42PV8akUK2KndEwmddA9eIFUBqUQujRNztubxI5eqaAz'+
                                        'iI5OFaPgUzJ1bASfwlR00PF4u9H1a8fOLy+em2vMn59v1Ns93wPFoik4y4zKk4gYUVtpXJI4gDcg'+
                                        'ExifF+AJY3/ZbVAzDncDhB+/QM9itW6MzdqfS3IDLKYEzCTWkCiYwpu5Wrt+caFZe+QYfdoFRjZV'+
                                        'zecr+Uy+kHXz09V8qZTLlnJ5pzCeZhlgmjinDhGHYMya8KF6Y0eqkv1Yae33fN5r9vxOyxON2Yut'+
                                        '+mKj0wJBt2YWmwA0Xi8AfEfscB2KghcxK02aubMFFiRwgKQooKuPnnV4lkLYEUCiAgDqiR1T5ZEo'+
                                        'gBhgrSKBrHgxv08tchOPe1MJChAXvpMw3yBlp0ljuCHBhfl659zc8rwuX5fYnk4xp1LIQnQGgZrD'+
                                        'UphABmN3kSCZVi4g9UCW73GOwvebAOVg2mjZetkdmDhFaMffw3jfSbI8ezxITOg8IWwLYqw+SQE6'+
                                        'sfu4IgxCAnlOXqdHXvvCAyMlgUmKYAvV0SeYBPG2gqTjEcAABXASSCVNSI3Kw3VYfK6CYgnaXK3V'+
                                        'jBo2Xb5wwt5ERu83RJ2+HadIkpWTAQO/muXHrT9IUAAvhgId6xiEBpchATbi2Ld9PLEbrzsi6OdW'+
                                        '+EETMlIiAR3i4V8qNpE0SAnogLy4jTDxXLkk+c7KGxnTVchWkqWTmLWLVaA/bv08Jjwv5gq8GPR3'+
                                        'Y0eSAvSdY6fjkXtv20l+9KW3jQwBxAqkjVoXQBKEby4oHZvscGNxrRuvJxhwJCJAkgIMmEChseuh'+
                                        'q0QuYoD181V8f5BwPwgBVkoJ92LIEHcDcYKI5E/8/JteKAteRk0CRSwnzVdAB275es+a2EjFYlwn'+
                                        'drAVFCDOBdgABYjPXK5k+WQNKCCGVIBB8J8UBcSVIB4JxCeJ4nUCfQiANZr33rqTvP5FzxGjDgNF'+
                                        'zFpW8oU2y/cSEhvOgGMl3+8kpKDpCsmRoRMma8htJAk8iRSvpgiD0CAJEYIBYWFcsSRrxYT3L/3E'+
                                        'i0Rm1BVBA1wBt+rUBpHDJHgf1uLZgLKzJAQYpACDUGAUCpCkDDxBEcQKfGAlZUgStv35OBIJnJt4'+
                                        '/nNG1C5+SDTgKyiFyXX7AwSdRPJWEj6N5czZCsInK7yeVCCc9LpYQRHEkJHASsRw0DEo+TOoSjiq'+
                                        'R4LbagtF3BEKnyYUJbCEIoWVLDnpMV3hdTKACJIB1r9eF0AGCJ8MqQQrZQUNcgYrKErSd8T5l1hL'+
                                        '2njUCEAGKIKw4JevQNroKv6cDeHfBwl7kOUPSwKTBlasghDiChVjNUGLFVzSmuYMRpkKJmtQBBpT'+
                                        'BDIA1uMCtath2AqCpkMKnA55XaspxErKwRPGIkmAfBUlIkMIfM2TRaOeDVxNEZLgmQ8J12yAJa9m'+
                                        '6cMkfq5kBk6sggyrIcRK76/23hVb/NWcDh6UWKEDCFeSFduvB0NA+qiEvl5lWIvQxBrczcinhzdK'+
                                        'AQad4KBMW5J7SIJuOoRQ6YiFvhZlGFZgIgEZxSrcaiQCj9/+vwADAHhTRBxV3sEUAAAAAElFTkSu'+
                                        'QmCC'
            }
        };
    }
    
    var _frontzIndex    = 1000;
    var _window         = new Array();
    var _windowHandler  = new Array();
    var _parameter      = new Array();
    var _zOrder         = new Array();
    var _moveHandle     = null
    var _isFullscreen   = new Array();
    var _isMaximum      = new Array();
    var _isMinimum      = new Array();
    // a ‚É b‚ð’Ç‰Á
    function mergeArray(aryA , aryB) {
        for (var idx in aryB){
            if (typeof aryB[idx] == "object")
                aryA[idx] = mergeArray(aryA[idx], aryB[idx]);
            else
                aryA[idx] = aryB[idx];
        }
        return aryA;
    }
    Class.prototype.add = function( params ){
        if (params == null)
            params = {};
        params = mergeArray(this._defaultStyle, params);

        var handler = 'kowindow_' + new Date().getTime();
        if (params['id'] != null)
            handler = params['id'];

        _windowHandler.push(handler);
        _parameter[handler] = params;
        _zOrder[handler]    = ++ _frontzIndex;
        _isMaximum[handler]     = false;
        _isMinimum[handler]     = false;
        _isFullscreen[handler]  = false;

        var b = document.getElementById(handler);
        if ( document.getElementById(handler) != undefined )
            var baseWindow = $('#' + handler);
        else
            var baseWindow = $('<div>').attr('id' , handler);


        baseWindow.css('z-index' , _zOrder[handler]);
        baseWindow.css('position' , 'absolute');
        baseWindow.css('overflow' , 'hidden');

        if (params['modal'])
            params['keepforefront'] = true;
        if (params['keepcenter'])
            params['movable'] = false;
        for (var attr in this._defaultStyle) {
            baseWindow.css(attr , params[attr]);
        }
        
        /* 
         * title bar
         */
        if (params['titleBar']['visible']) {
            var titlebar = $('<div>')
                .attr('id' , handler + '_titlebar')
                .bind(fullevent , function(e) {
                    if( navigator.userAgent.indexOf('iPhone') > -1 ||  navigator.userAgent.indexOf('iPad') > -1 ||  navigator.userAgent.indexOf('iPod')  > -1) {
                        if (event.touches.length != 2)
                            return true;
                    }
                    if (_parameter[handler]['fullscreentoggle']){
                        if (_isMinimum[handler])
                            Class.prototype.minimum_toggle( handler );
                        else
                            Class.prototype.maximum_toggle( handler );
                    }
                    return true;
                });
                for (attr in params['titleBar']) {
                    titlebar.css(attr, params['titleBar'][attr]);
                }
            var titleCaption = $('<div>')
                .attr('id' , handler + '_caption')
                .text(params['titleBar']['caption']['text'])
                .css({float : 'left' });
                for (attr in params['titleBar']['caption']) {
                    titlebar.css(attr, params['titleBar']['caption'][attr]);
                }
                titlebar.append(titleCaption);
            /* 
             * close button
             */
            if (params['titleBar']['close_button']) {
                var close_button = $('<img>')
                    .attr({ id      : handler + '_button_close'
                          , width   : params['titleBar']['height']
                          , height  : params['titleBar']['height']
                          , src     : params['titleBar']['close_image']
                    })
                    .css({float : 'right' });
                    close_button.mouseover( function (e) {
                        close_button.css({ cursor : 'pointer'});
                    });
                    close_button.bind(start, function (e) {
                        Class.prototype.close( baseWindow.attr('id') );
                    });
                titlebar.append(close_button);
            }
            /* 
             * maximum button
             */
            if (params['titleBar']['maximum_button']) {
                var maximum_button = $('<img>')
                    .attr({ id      : handler + '_button_maximum'
                          , width   : params['titleBar']['height']
                          , height  : params['titleBar']['height']
                          , src     : params['titleBar']['maximum_image']
                    })
                    .css({  float   : 'right'   });
                    maximum_button.mouseover( function (e) {
                        maximum_button.css({ cursor : 'pointer'});
                    });
                    maximum_button.bind(start, function (e) {
                        Class.prototype.maximum_toggle( baseWindow.attr('id') );
                    });
                titlebar.append(maximum_button);
            }
            /* 
             * minimum button
             */
            if (params['titleBar']['minimum_button']) {
                var minimum_button = $('<img>')
                    .attr({ id      : handler + '_button_minimum'
                          , width   : params['titleBar']['height']
                          , height  : params['titleBar']['height']
                          , src     : params['titleBar']['minimum_image']
                    })
                    .css({  float   : 'right'   });
                    minimum_button.mouseover( function (e) {
                        minimum_button.css({ cursor : 'pointer'});
                    });
                    minimum_button.bind(start, function (e) {
                        Class.prototype.minimum_toggle( baseWindow.attr('id') );
                    });
                titlebar.append(minimum_button);
            }
            baseWindow.prepend(titlebar);
        }
        /*
         * inner contents
         */
        var innerWindow = $('<div>');
        if (params['innerWindow']['content_frame']) {
            innerWindow = $('<iframe>');
        }
        innerWindow.attr('id' , handler + '_innerWindow');
        innerWindow.css({ top :'0px',left:'0px',width:'100%',border:'0' });

        

        for (attr in params['innerWindow']) {
            innerWindow.css(attr, params['innerWindow'][attr]);
        }
        // title bar
        if (params['titleBar']['visible']) {
            innerWindow.css('top' , params['titleBar']['height']);
            var innerHeight =  (baseWindow.height() - titlebar.height()) / baseWindow.height() * 100 + '%';
            innerWindow.css('height' , innerHeight);
        }
        if (params['innerWindow']['content_frame']) {
            innerWindow.attr('src' , params['innerWindow']['framesource']);
            innerWindow.load( function(e){
                var th = 0;
                if (params['titleBar']['visible'])
                    th = titlebar.height();
                if (params['innerWindow']['autoresize']) {
                    var h = innerWindow[0].contentWindow.document.documentElement.scrollHeight + 10;
                    var w = innerWindow[0].contentWindow.document.documentElement.scrollWidth + 10;
                    if (baseWindow.height() < h){
                        params['height'] = h + th + 'px';
                    }
                    if (baseWindow.width() < w){
                        params['width'] = w + th + 'px';
                    }
                    Class.prototype.setParameter(baseWindow.attr('id') , params);
                } 
                if (params['titleBar']['visible'])
                    var innerHeight =  (baseWindow.height() - th) / baseWindow.height() * 100 + '%';
                else
                    var innerHeight =  '100%';
                innerWindow.css('height' , innerHeight);
            });
        }
        baseWindow.append(innerWindow);
        $(this.elements.selector).append(baseWindow);
        //$(this.elements.selector).css('overflow' , 'hidden');
        
        _window[handler] = baseWindow;
        var pos = baseWindow.position();
        params['height'] = baseWindow.height() + 'px';
        params['width'] = baseWindow.width() + 'px';
        if (pos == null) {
            params['top'] = '0px';
            params['left'] = '0px';
        } else {
            params['top'] = pos.top + 'px';
            params['left'] = pos.left + 'px';
        }
        Class.prototype.setParameter(handler , params);
        if (params['movable']) {
            baseWindow
            .mouseover( function(e) {
                if( navigator.userAgent.indexOf('iPhone') > -1 ||  navigator.userAgent.indexOf('iPad') > -1 ||  navigator.userAgent.indexOf('iPod')  > -1)
                    e = event.touches[0];
                if (baseWindow.attr('id') == e.target.id && params['resizeble']){
                    var position = baseWindow.position();
                    var lf = position.left;
                    var tp = position.top;
                    var wt = baseWindow.width();
                    var ht = baseWindow.height();
                    if ( lf <= e.pageX && lf+2 >= e.pageX)
                        baseWindow.css('cursor','w-resize');
                    else if ( tp <= e.pageY && tp+2 >= e.pageY)
                        baseWindow.css('cursor','n-resize');
                    else if ( wt + lf <= e.pageX && wt + lf + 4 >= e.pageX)
                        baseWindow.css('cursor','e-resize');
                    else if ( ht + tp <= e.pageY && ht + tp + 4 >= e.pageY)
                        baseWindow.css('cursor','s-resize');
                } else {
                    baseWindow.css('cursor','default');
                }
            });
        }
        return this;
    };
    
    $(window)
        .bind(start, function(e){
            if( navigator.userAgent.indexOf('iPhone') > -1 ||  navigator.userAgent.indexOf('iPad') > -1 ||  navigator.userAgent.indexOf('iPod')  > -1){
                //event.preventDefault();
                e = event.touches[0];
            }
            if (e.target.id == '')
                return true;
            for (var idx in _windowHandler) {
                if (e.target.id.indexOf(_windowHandler[idx]) != -1 ) {
                    var handle = _windowHandler[idx];
                    break;
                }
            }
            for (var mdl in _parameter) {
                if (_parameter[mdl]['modal']) {
                    e.originalEvent.cancelBubble = true
                    e.originalEvent.returnValue = false;
                    return false;
                }
            }
            if (handle == null || handle == '' || handle == undefined || _window[handle] == undefined)
                return true;
            Class.prototype.forefront(handle);
            if (_parameter[handle]['movable']){
                if (_moveHandle == null) {
                    if (    handle  + '_button_close' == e.target.id
                        ||  handle  + '_button_maximum' == e.target.id
                        ||  handle  + '_button_minimum' == e.target.id
                        || _isMaximum[handle]
                        || _isFullscreen[handle]) {
                            return;
                    }
                    var moveMethod = '';
                    var position =  _window[handle].position();
                    var lf = position.left;
                    var tp = position.top;
                    var wt = _window[handle].width();
                    var ht = _window[handle].height();
                    if (_parameter[handle]['resizeble']){
                        if ( lf <= e.pageX && lf+2 >= e.pageX)
                            moveMethod = 'left_resize';
                        else if ( tp <= e.pageY && tp+2 >= e.pageY)
                            moveMethod = 'top_resize';
                        else if ( wt + lf <= e.pageX && wt + lf + 4 >= e.pageX)
                            moveMethod = 'right_resize';
                        else if ( ht + tp <= e.pageY && ht + tp + 4 >= e.pageY)
                            moveMethod = 'bottom_resize';
                        else
                            moveMethod = 'move';
                    } else {
                        moveMethod = 'move';
                    }
                    _moveHandle = 
                        {    handle :handle
                         ,  startX   : e.pageX
                         ,  startY   : e.pageY
                         ,  method   : moveMethod
                    };
                }
            }
        })
        .bind(end , function(e){
            if( navigator.userAgent.indexOf('iPhone') > -1 ||  navigator.userAgent.indexOf('iPad') > -1 ||  navigator.userAgent.indexOf('iPod')  > -1){
                //event.preventDefault();
                e = event.touches[0];
            }
            if (_moveHandle != null) {
                var handle  = _moveHandle['handle'];
                _window[handle].css('cursor','default');
            }
            _moveHandle = null;
        })
        .bind(move , function(e){
            if( navigator.userAgent.indexOf('iPhone') > -1 ||  navigator.userAgent.indexOf('iPad') > -1 ||  navigator.userAgent.indexOf('iPod')  > -1) {
                //event.preventDefault();
                e = event.touches[0];
                if (event.touches.length != 1) {
                    _moveHandle = null;
                }
            }
            if (_moveHandle != null) {
                var handle  = _moveHandle['handle'];
                var method  = _moveHandle['method'];
                var move_x  = parseInt(e.pageX - _moveHandle['startX']);
                var move_y  = parseInt(e.pageY - _moveHandle['startY']);
                var left    = parseInt(_parameter[handle]['left']);
                var top     = parseInt(_parameter[handle]['top']);
                var width   = parseInt(_parameter[handle]['width']);
                var height  = parseInt(_parameter[handle]['height']);
                
                if (method == 'left_resize') {
                    _window[handle].css('cursor','w-resize');
                    move_x *= -1;
                    left  -= move_x;
                    width += move_x;
                } else if (method == 'right_resize') {
                    _window[handle].css('cursor','e-resize');
                    width +=move_x;
                } else if (method == 'top_resize') {
                    move_y *= -1;
                    top    -= move_y;
                    height += move_y;
                } else if (method == 'bottom_resize') {
                    _window[handle].css('cursor','s-resize');
                    height += move_y;
                } else if (method == 'move') {
                    _window[handle].css('cursor','move');
                    left += move_x;
                    top  += move_y;
                }
                if (left < 0)
                    left = 0;
                if (top < 0)
                    top = 0;
                if (width < 100)
                    width = 100;
                if (height < parseInt(_parameter[handle]['titleBar']['height']))
                    height = parseInt(_parameter[handle]['titleBar']['height']);
                _parameter[handle]['left']      = left   + 'px';
                _parameter[handle]['top']       = top    + 'px';
                _parameter[handle]['width']     = width  + 'px';
                _parameter[handle]['height']    = height + 'px';
                Class.prototype.setParameter(handle , _parameter[handle]);
                _moveHandle['startX'] = e.pageX;
                _moveHandle['startY'] = e.pageY;
            }
        })
        .bind('gesturechange' , function(e) {
            //event.preventDefault();
            if (e.target.id == '')
                return true;
            for (var idx in _windowHandler) {
                if (e.target.id.indexOf(_windowHandler[idx]) != -1 ) {
                    var handle = _windowHandler[idx];
                    break;
                }
            }
            for (var mdl in _parameter) {
                if (_parameter[mdl]['modal']) {
                    e.originalEvent.cancelBubble = true
                    e.originalEvent.returnValue = false;
                    return false;
                }
            }
            if (handle == null || handle == '' || handle == undefined || _window[handle] == undefined)
                return true;
            if (_parameter[handle]['resizeble']){
                var width   = parseInt(_parameter[handle]['width']);
                var height  = parseInt(_parameter[handle]['height']);
                width  *= event.scale;
                height *= event.scale;
                if (width > $(window).width())
                    width = $(window).width();
                if (height > $(window).height() )
                    height = $(window).height();
                
                _window[handle].css('width'  , width  + 'px');
                _window[handle].css('height' , height + 'px');
            }
        }).bind('gestureend' , function(e) {
            //event.preventDefault();
            if (e.target.id == '')
                return true;
            for (var idx in _windowHandler) {
                if (e.target.id.indexOf(_windowHandler[idx]) != -1 ) {
                    var handle = _windowHandler[idx];
                    break;
                }
            }
            for (var mdl in _parameter) {
                if (_parameter[mdl]['modal']) {
                    e.originalEvent.cancelBubble = true
                    e.originalEvent.returnValue = false;
                    return false;
                }
            }
            if (handle == null || handle == '' || handle == undefined || _window[handle] == undefined)
                return true;
            if (_parameter[handle]['resizeble']){
                _parameter[handle]['width'] = _window[handle].width();
                _parameter[handle]['height']= _window[handle].height();
                Class.prototype.setParameter(handle , _parameter[handle]);
            }
        })
        .resize(function() {
            for (var idx in _windowHandler) {
                var id = _windowHandler[idx];
                if (_isMaximum[id]){
                    _isMaximum[id] = false;
                    Class.prototype.maximum_toggle(id);
                } else if (_isFullscreen[id]) {
                    _isFullscreen[id] = false;
                    Class.prototype.fullscreen_toggle(id);
                } else {
                    Class.prototype.setParameter(id , _parameter[id]);
                }
            }
        }).keyup(function(e){
            if (e.shiftKey && e.ctrlKey){
                switch(e.keyCode) {
                    case 115:
                        Class.prototype.close();
                        break;
                    case 13: 
                        Class.prototype.fullscreen_toggle();
                        break;
                }
            }
        });
    
    /* ***********************************************************************
     * @brief   window is maximized.
     * @param   handleId    window id
     * ***********************************************************************/
    Class.prototype.maximum_toggle = function(handleId) {
        if (handleId == null)
            handleId = Class.prototype.forefrontId();
        Class.prototype.forefront(handleId);
        _isMinimum[handleId] = false;
        
        var innerHeight = '100%';
        if ( _isMaximum[handleId]) {
            _window[handleId].css('border' , _parameter[handleId]['border']);
            var h = _parameter[handleId]['height'];
            var w = _parameter[handleId]['width'];
            var t = _parameter[handleId]['top'];
            var l = _parameter[handleId]['left'];
            _window[handleId].animate({top:t,left:l,width:w,height:h} , 300);
            
            if (_parameter[handleId]['titleBar']['visible'])
                h = parseInt(h) - parseInt(_parameter[handleId]['titleBar']['height']) + 'px';
            $('#' + handleId + '_innerWindow').animate({ width : w , height : h} , 300);
            _isMaximum[handleId] = false;
        } else {
            _window[handleId].css('border' , '');
            var h = $(window).height();
            var w = $(window).width();

            if (_parameter[handleId]['titleBar']['visible'])
                innerHeight =  h - parseInt(_parameter[handleId]['titleBar']['height']) + 'px';
            $(window).scrollTop(0);
            
            _window[handleId].animate({ top : '0px' , left : '0px' , width : w +'px' , height : h +'px'} , 300);
            $('#' + handleId + '_innerWindow').animate({ width : '100%' , height : innerHeight} , 300);
            _isMaximum[handleId] = true;
        }

        return this;
    }
    Class.prototype.minimum_toggle = function(handleId) {
        if (handleId == null)
            handleId = Class.prototype.forefrontId();
        Class.prototype.forefront(handleId);
        _isMaximum[handleId] = false;
        if ( _isMinimum[handleId]) {
            var h = _parameter[handleId]['height'];
            var w = _parameter[handleId]['width'];
            var t = _parameter[handleId]['top'];
            var l = _parameter[handleId]['left'];
            _window[handleId].animate({top:t,left:l,width:w,height:h} , 300,null);
            if (_parameter[handleId]['titleBar']['visible'])
                h = parseInt(h) - parseInt(_parameter[handleId]['titleBar']['height']) + 'px';
            $('#' + handleId + '_innerWindow').animate({ width : w , height : h} , 300);
            $('#' + handleId + '_caption').css('display' , 'block');
            _isMinimum[handleId] = false;
        } else {
            var width = parseInt(_parameter[handleId]['titleBar']['height']);
            if (_parameter[handleId]['titleBar']['close_button'])
                width += parseInt(_parameter[handleId]['titleBar']['height']);
            if (_parameter[handleId]['titleBar']['maximum_button'])
                width += parseInt(_parameter[handleId]['titleBar']['height']);
            if (_parameter[handleId]['titleBar']['minimum_button'])
                width += parseInt(_parameter[handleId]['titleBar']['height']);
            _window[handleId].animate({ width   : width + 'px' , height : _parameter[handleId]['titleBar']['height']} , 300);
            $('#' + handleId + '_caption').css('display' , 'none');
            $('#'+ handleId + '_innerWindow').animate({ height  : '0px'} , 300);
            _isMinimum[handleId] = true;
        }
        return this;
    }
    Class.prototype.fullscreen_toggle = function(handleId) {
        if (handleId == null)
            handleId = Class.prototype.forefrontId();
            
        if (! _parameter[handleId]['fullscreentoggle'])
            return this;
        Class.prototype.forefront(handleId);
        _isMinimum[handleId] = false;
        _isMaximum[handleId] = false;
        if ( _isFullscreen[handleId]) {
            Class.prototype.setParameter(handleId , _parameter[handleId]);
            _window[handleId].css('border' , _parameter[handleId]['border']);
            $('#' + handleId + '_titlebar').css('display' , 'block');
            $('#' + handleId + '_innerWindow').css({ top:'0px',left:'0px',width:w,height:h});
             _isFullscreen[handleId] = false;
        } else {
            var w = $(window).width() +'px'
            var h = $(window).height()+'px';
            $(window).scrollTop(0);

            if (_parameter[handleId]['titleBar']['visible'])
                $('#' + handleId + '_titlebar').css('display' , 'none');
            _window[handleId].css('border' , '');
            _window[handleId].css({top:'0px',left:'0px',width:w,height:h});
            $('#' + handleId + '_innerWindow').css({ top:'0px',left:'0px',width:w,height:h ,overflow:'auto'});
            _isFullscreen[handleId] = true;
        }
        return this;
    }
    Class.prototype.close = function(handleId) {
        if (handleId == null)
            handleId = Class.prototype.forefrontId();
        Class.prototype.forefront(handleId);
        //_window[handleId].remove();
        _window[handleId].css('display' , 'none');
        //delete _window[handleId];
        //delete _parameter[handleId];
        //delete _zOrder[handleId];
        //delete _isFullscreen[handleId];
        //delete _isMaximum[handleId];
        //delete _isMinimum[handleId];
        _moveHandle = null;
        _frontzIndex--;
        return this;
    }
    Class.prototype.forefrontId = function() {
        for (var id in _zOrder) {
            if (_frontzIndex == _zOrder[id]){
                return id;
            }
        }
    }
    Class.prototype.setParameter = function(handleId , params) {
        params = _parameter[handleId] = mergeArray(_parameter[handleId], params);
        for (var attr in params)
            _window[handleId].css(attr , params[attr]);
        if (params['keepcenter']) {
            var left = ($(window).width() - _window[handleId].width()) / 2 + 'px';
            var top  = ($(window).height() - _window[handleId].height()) / 2 + 'px';
            _window[handleId].css('left' , left);
            _window[handleId].css('top' , top);
        }

        var h = _window[handleId].height();
        if (params['titleBar']['visible'])
            h -= parseInt(_parameter[handleId]['titleBar']['height']);
        _isMaximum[handleId] = false;
        _isMinimum[handleId] = false;
        _isFullscreen[handleId] = false;
        $('#'+ handleId + '_innerWindow').css('height' , h + 'px');
        $('#'+ handleId + '_innerWindow').css('width' , '100%');
        
        var pos = _window[handleId].position();
        if (pos == null) {
            _parameter[handleId]['top'] = '0px';
            _parameter[handleId]['left'] = '0px';
        } else {
            _parameter[handleId]['top'] = pos.top + 'px';
            _parameter[handleId]['left'] = pos.left + 'px';
        }
        var capt_width = $('#' + handleId + '_titlebar').width() - 50; 
        if (_parameter[handleId]['titleBar']['close_button'])
            capt_width -= $('#' + handleId + '_button_close').width();
        if (_parameter[handleId]['titleBar']['maximum_button'])
            capt_width -= $('#' + handleId + '_button_maximum').width();
        if (_parameter[handleId]['titleBar']['minimum_button'])
            capt_width -= $('#' + handleId + '_button_minimum').width();
        $('#' + handleId + '_caption').css('width' , capt_width + 'px');
        _parameter[handleId]['width'] = _window[handleId].width() + 'px';
        _parameter[handleId]['height'] = _window[handleId].height() + 'px';
        return this;

    }
    Class.prototype.forefront = function(handleId) {
        var setfront = function(id) {
            if (id == null) 
                id = _zOrder[1];
            if (id != null) {
                for (var handleKey in _zOrder) {
                    if (_zOrder[handleKey] > _zOrder[id]){
                        _zOrder[handleKey] = _zOrder[handleKey] - 1;
                        _window[handleKey].css('z-index' , _zOrder[handleKey]);
                    }
                }
                _zOrder[id] = _frontzIndex;
                _window[id].css('z-index' , _frontzIndex);
            }
        }
        setfront(handleId);
        // check fore-front flag
        for (var handleKey in _zOrder) {
            if (_parameter[handleKey]['keepforefront']){
                setfront(handleKey);
            }
        }
        return this;
    };
    Class.prototype.show = function(handleId) {
        _window[handleId].css('display' , 'block');
    };
    Class.prototype.isWindow = function(handleId) {
        var isHandler = false;
        for (var idx in _windowHandler) {
            if (handleId.indexOf(_windowHandler[idx]) != -1 ) {
                return true;
            }
        }
        return false;
    };
    Class.prototype.innerContent = function(handleId) {
        if (handleId == null)
            handleId = Class.prototype.forefrontId();
        return $('#' + handleId + '_innerWindow');
    }
    $.fn[plugname] = function(params){
        return new Class(this, $.extend(this._defaultStyle , params, {}));
    }
})(jQuery);
