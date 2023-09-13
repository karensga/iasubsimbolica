import * as tf from '@tensorflow/tfjs';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import './App.css';
import { Container, ContainerPeso, ContainerResultado, ContainerSum, Sum, Title } from './style';


function App() {
  const [model, setModel] = useState<any>()
  const [resultado, setResultado] = useState(0)
  const { register, handleSubmit, watch } = useForm({ defaultValues :{
    entrada1: "0",
    entrada2: "0",
    entrada3: '0'
  }})

  const watchValue1 = watch('entrada1') ?? 'X1'
  const watchValue2 = watch('entrada2') ?? 'X2'
  const watchValue3 = watch('entrada3') ?? 'X3'

  useEffect(() => {
    cargarModelo()
  },[])

  async function cargarModelo() {
    const modelcargado = await tf.loadLayersModel('/model.json' as any).catch(e => console.log(e))
    setModel(modelcargado)
  }

  async function hacerPrediccion(model:any, entrada:any) {
    const tensorEntrada: any = tf.tensor([...entrada], [1, 3]);
    const prediccion = model.predict(tensorEntrada);
    const valores = await prediccion.data();
    tensorEntrada.dispose();
    prediccion.dispose();
    return valores;
  }
  

  const onSubmit = async (data: any) => {
    const entrada = [parseFloat(data.entrada1), parseFloat(data.entrada2), parseFloat(data.entrada3)];
    const prediccion = await hacerPrediccion(model, entrada);
    setResultado(prediccion[0])
  }

  return (
    <>
      <Title>I.A Subsimbólica</Title>
      <Container>
        <form onSubmit={handleSubmit(onSubmit)} className='container_submit'>
          <h1>X1</h1>
          <input type="number" {...register('entrada1')} />
          <h1>X2</h1>
          <input type="number" {...register('entrada2')} />
          <h1>X3</h1>
          <input type="number" {...register('entrada3')} />
          <button onClick={onSubmit} type='submit' >Calcular</button>
        </form>

        <ContainerPeso>
          <Sum>W1 = 0.5</Sum>
          <Sum>W2 = 0.2</Sum>
          <Sum>W3 = 0.3</Sum>
        </ContainerPeso>

        <ContainerSum>
          <Sum>{`${watchValue1}* 0.5 + ${watchValue2}* 0.3 + ${watchValue3}* 0.2`}</Sum>
          <Sum style={{ fontSize: '1.2rem'}}>{`X1 * W1 + X2 * W2 + X3 * W3`}</Sum>
        </ContainerSum>
        <ContainerResultado>
          <Sum>{`${resultado.toFixed(2)} >  ${3} `}</Sum>
          <Sum>{`${resultado>3 ? 'Gana la materia':'Pierde la materia'}`}</Sum>
        </ContainerResultado>
      </Container>
    </>
  )
}

export default App
