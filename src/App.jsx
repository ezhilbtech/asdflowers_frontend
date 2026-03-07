import { useState } from "react";
import axios from "axios";
import "./App.css";

const flowers = [
  "மல்லி - Malli",
  "காகட்டான் - Kakattan",
  "சாமந்தி - Samanthi",
  "கோழிகொண்டை - Kozhikondai",
  "கேந்தி - Kaenthi",
  "முல்லை - Mullai",
  "கனகாம்பரம் - Kanakambaram",
  "ஜாதி - Jathi",
  "பன்னீர் ரோஜா - Panner Rose"
];

export default function App(){

const [flower,setFlower]=useState("");

const [rows,setRows]=useState([]);

const [form,setForm]=useState({
userName:"",
villageName:""
})

const [billId,setBillId]=useState(null)

/* ADD ROW */

const addRow=()=>{

setRows([
...rows,
{date:"",quantity:0,rate:0,borrow:0,total:0}
])

}

/* DELETE ROW */

const deleteRow=(index)=>{

const updated=[...rows]

updated.splice(index,1)

setRows(updated)

}

/* UPDATE ROW */

const updateRow=(i,key,val)=>{

const updated=[...rows]

updated[i][key]=val

const qty=updated[i].quantity || 0
const rate=updated[i].rate || 0

updated[i].total = qty * rate

setRows(updated)

}

/* TOTAL */

const total = rows.reduce((sum,row)=>sum + row.total ,0)

/* BORROW TOTAL */

const borrowTotal = rows.reduce((sum,row)=>sum + (row.borrow || 0) ,0)

/* COMMISSION */

const commission = total * 0.10

/* FINAL AMOUNT */

const finalAmount = total - commission - borrowTotal

/* SAVE BILL */

const saveBill = async()=>{

const payload={
...form,
flowerName:flower,
items:rows
}

const res = await axios.post(
"https://asdflowers.onrender.com/api/bills",
payload
)

setBillId(res.data.id)

alert("Bill Saved")

}

/* DOWNLOAD PDF */

const downloadPDF=()=>{

if(!billId){
alert("Save bill first")
return
}

window.open(
`https://asdflowers.onrender.com/api/bills/pdf/${billId}`
)

}

/* DELETE ALL DATA */

const deleteAll = async()=>{

await axios.delete(
"https://asdflowers.onrender.com/api/bills/deleteAll"
)

alert("All Data Deleted")

setRows([])
setBillId(null)

}

return(

<div className="container">

<h1>ASD FLOWER BILLING</h1>

<div className="customer">

<input
placeholder="Customer Name"
onChange={e=>setForm({
...form,
userName:e.target.value
})}
/>

<input
placeholder="Village"
onChange={e=>setForm({
...form,
villageName:e.target.value
})}
/>

</div>

<div className="flowerRow">

<label>Flower</label>

<select onChange={e=>setFlower(e.target.value)}>

<option>Select Flower</option>

{flowers.map((f,i)=>(
<option key={i}>{f}</option>
))}

</select>

</div>

<button className="addBtn" onClick={addRow}>
Add Row
</button>

<div className="tableWrapper">

<table>

<thead>
<tr>
<th>Date</th>
<th>Weight</th>
<th>Rate</th>
<th>Borrow</th>
<th>Total</th>
<th></th>
</tr>
</thead>

<tbody>

{rows.map((r,i)=>(

<tr key={i}>

<td>
<input
type="date"
onChange={e=>updateRow(i,"date",e.target.value)}
/>
</td>

<td>
<input
type="number"
onChange={e=>updateRow(i,"quantity",Number(e.target.value))}
 />
</td>

<td>
<input
type="number"
onChange={e=>updateRow(i,"rate",Number(e.target.value))}
 />
</td>

<td>
<input
type="number"
placeholder="Borrow"
onChange={e=>updateRow(i,"borrow",Number(e.target.value))}
 />
</td>

<td>{r.total}</td>

<td>
<button
className="deleteBtn"
onClick={()=>deleteRow(i)}
>
Delete
</button>
</td>

</tr>

))}

</tbody>

</table>

</div>

<div className="summary">

<h3>Total ₹ {total}</h3>

<h4>Commission 10% ₹ {commission}</h4>

<h4>Borrow ₹ {borrowTotal}</h4>

<h2>Final Amount ₹ {finalAmount}</h2>

</div>

<div className="buttons">

<button onClick={saveBill}>
Save Bill
</button>

<button onClick={downloadPDF}>
Download PDF
</button>

<button onClick={deleteAll}>
Delete All Data
</button>

</div>

</div>

)

}
