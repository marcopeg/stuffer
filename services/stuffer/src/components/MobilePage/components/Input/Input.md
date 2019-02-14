```js
const mr = { marginRight: 10 }
const mb = { marginBottom: 10 }
;<MobilePageStyleguidist.Component>
    <h3>Basic input:</h3>
    <Input />

    <h3>With placeholder:</h3>
    <Input placeholder={'write something'} />

    <h3>Centered:</h3>
    <Input centered placeholder={'write something'} style={{ width: '50%' }} />

    <h3>Block:</h3>
    <Input block placeholder={'write something'} />
</MobilePageStyleguidist.Component>
```