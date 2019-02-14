```js
const mr = { marginRight: 10 }
const mb = { marginBottom: 10 }
;
<MobilePageStyleguidist.Component>
    <h3>Inline button:</h3>
    <Button style={mr}>Primary button</Button>
    <Button type={'secondary'} style={mr}>Secondary button</Button>
    <Button type={'link'} style={mr}>Link button</Button>

    <h3>Block button:</h3>
    <Button block style={mb}>Primary button</Button>
    <Button block type={'secondary'} style={mb}>Secondary button</Button>
    <Button block type={'link'} style={mb}>Link button</Button>

    <h3>Sizes:</h3>
    <Button style={mr} size={'small'}>Size: small</Button>
    <Button style={mr} size={'normal'}>Size: normal</Button>
    <Button style={mr} size={'big'}>Size: big</Button>
</MobilePageStyleguidist.Component>
```

Link Button

```js
<MobilePageStyleguidist.Component withRouter>
    <Button linkTo={'/foo'} />
</MobilePageStyleguidist.Component>
```