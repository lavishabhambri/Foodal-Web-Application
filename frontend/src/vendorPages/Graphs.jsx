import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {Bar} from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { returnLocalStorage } from "../components/LocalStorageHelper";
Chart.register(...registerables);



const Graphs = () => {
    const tokenData = returnLocalStorage().token;
    const [ug1, setug1] = useState(null)
    const [ug2, setug2] = useState(null)
    const [ug3, setug3] = useState(null)
    const [ug4, setug4] = useState(null)
    const [ug5, setug5] = useState(null)
    const [age, setAge] = useState([])
    const [ageX, setAgeX] = useState(null)
    const [ageY, setAgeY] = useState(null)

    useEffect(() => {
        axios.get("http://localhost/api/orders/graphs", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": tokenData,
            },
        })
            .then((res) => {
                console.log(res.data);
                setug1(res.data.UG1);
                setug2(res.data.UG2);
                setug3(res.data.UG3);
                setug4(res.data.UG4);
                setug5(res.data.UG5);
                setAge(res.data.AgeData);
                setAgeX(res.data.AgeX);
                setAgeY(res.data.AgeY);

            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const state1 = {
        labels: ['UG1', 'UG2', 'UG3','UG4', 'UG5'],
        datasets: [
          {
            label: 'Completed Orders',
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: [ug1, ug2, ug3, ug4, ug5]
          }
        ]
      }

      
      const state2 = {
        labels: ageX,
        datasets: [
          {
            label: 'Completed Orders',
            backgroundColor: '#FBCAFF',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 2,
            data: ageY
          }
        ]
      }

    return (
      <div className="container">
          <h2 style={{margin:"70px auto"}}>Graph to view total completed orders per batch</h2>
        <div style={{maxWidth:"60%"}}>
        {ug1 === null ? "Loading..." :
            <Bar
            data={state1}
            options={{
                title:{
                display:true,
                text:'Total completed orders per batch',
                fontSize:10
                },
                legend:{
                display:true,
                position:'right'
                }
            }}
            />
        }
        </div>



        <h2 style={{margin:"70px auto"}}>Graph to view total completed orders per age</h2>
        <div style={{maxWidth:"60%"}}>
            {console.log(ageX)}
        {ageX === null ? "Loading..." :
            <Bar
            data={state2}
            options={{
                title:{
                display:true,
                text:'Total completed orders per age',
                fontSize:10
                },
                legend:{
                display:true,
                position:'right'
                }
            }}
            />
        }
        </div>

      </div>
    );
}



export default Graphs;