```js
const { flexCentered } = require('../../lib/mixins')
const gridStyle = {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
}
const loaderStyle = {
    ...flexCentered,
    flexDirection: 'column',
    fontFamily: 'monospace',
    fontSize: 12,
    margin: 25,
}
;<MobilePageStyleguidist.Component>
    <h3>Loaders</h3>
    <div style={gridStyle}>
        <div style={loaderStyle}>
            <Loading type={'Audio'} block />
            Audio
        </div>
        <div style={loaderStyle}>
            <Loading type={'Ball-Triangle'} block />
            Ball-Triangle
        </div>
        <div style={loaderStyle}>
            <Loading type={'Bars'} block />
            Bars
        </div>
        <div style={loaderStyle}>
            <Loading type={'Circles'} block />
            Circles
        </div>
    </div>
    <div style={gridStyle}>
        <div style={loaderStyle}>
            <Loading type={'Grid'} block />
            Grid
        </div>
        <div style={loaderStyle}>
            <Loading type={'Hearts'} block />
            Hearts
        </div>
        <div style={loaderStyle}>
            <Loading type={'Oval'} block />
            Oval
        </div>
        <div style={loaderStyle}>
            <Loading type={'Puff'} block />
            Puff
        </div>
    </div>
    <div style={gridStyle}>
        <div style={loaderStyle}>
            <Loading type={'Rings'} block />
            Rings
        </div>
        <div style={loaderStyle}>
            <Loading type={'TailSpin'} block />
            TailSpin
        </div>
        <div style={loaderStyle}>
            <Loading type={'ThreeDots'} block />
            ThreeDots
        </div>
    </div>
    <h3>Size</h3>
    <Loading block size={'small'} />
    <Loading block size={'normal'} />
    <Loading block size={'big'} />
    <h3>With Button</h3>
    <div><Button size={'small'}>A Button</Button><Loading size={'small'} /></div>
    <div><Button>A Button</Button><Loading /></div>
    <div><Button size={'big'}>A Button</Button><Loading size={'big'} /></div>
</MobilePageStyleguidist.Component>
```