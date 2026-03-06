import { useState } from "react";
import axios from "axios";
import "./App.css";

const flowers = [
  "மல்லி - Malli",
  "காகட்டான் - Kakattan",
  "சாமந்தி - Samanthi",
  "கோழிகொண்டை - Kozhikondai",
  "கேந்தி - kaenthi",
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
villageName:"",
advance:0
})

const [billId,setBillId]=useState(null)

const addRow=()=>{

setRows([
...rows,
{date:"",quantity:0,rate:0,total:0}
])

}

const deleteRow=(index)=>{

const updated=[...rows]

updated.splice(index,1)

setRows(updated)

}

const updateRow=(i,key,val)=>{

const updated=[...rows]

updated[i][key]=val

updated[i].total=
updated[i].quantity*
updated[i].rate

setRows(updated)

}

const total=rows.reduce((s,r)=>s+r.total,0)

const commission=total*0.10

const finalAmount=
total-commission-form.advance

const saveBill=async()=>{

const payload={
...form,
flowerName:flower,
items:rows
}

const res=await axios.post(
"https://asdflowers.onrender.com",
payload
)

setBillId(res.data.id)

alert("Bill Saved")

}

const downloadPDF=()=>{

if(!billId){
alert("Save bill first")
return
}

window.open(
`http://localhost:8080/api/bills/pdf/${billId}`
)

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

<select
onChange={e=>setFlower(e.target.value)}
>

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

<input
type="number"
placeholder="Advance"
onChange={e=>setForm({
...form,
advance:Number(e.target.value)
})}
/>

<h2>Final Amount ₹ {finalAmount}</h2>

</div>

<div className="buttons">

<button onClick={saveBill}>
Save Bill
</button>

<button onClick={downloadPDF}>
Download PDF
</button>

</div>

</div>

)

}
