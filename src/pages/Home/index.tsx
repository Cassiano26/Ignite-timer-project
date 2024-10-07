import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountDownButton, StopCountDownButton } from "./styles";
import { createContext, useState } from "react";
import { NewCycleForm } from "./Components/NewcycleForm";
import { Countdown } from "./Components/CountDown";
import { FormProvider, useForm } from "react-hook-form";
import * as zod from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
}

export const CyclesContext = createContext({} as CyclesContextType)

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(1, 'o ciclo precisa ser no minimo 5 minutos').max(60, 'o ciclo precisa ser no máximo 60 minutos'),
})

type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema >

export function Home() {
  
  const [ cycles, setCycles ] = useState<Cycle[]>([])
  const [ activeCycleId, setActiveCycleId ] = useState<string | null>(null)
  const [ amountSecondsPassed, setAmountSecondsPassed ] = useState(0)

  const newCycleForm = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema), 
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const {handleSubmit, watch, reset} = newCycleForm

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    setCycles((state) => 
      state.map((cycle) => {
        if (cycle.id == activeCycleId) {
          return {...cycle, finishedDate: new Date()}
        } else {
          return cycle
        }
      })
    )
  }

  function handleCreateNewcycle(data: newCycleFormData ) {
     const id = String(new Date().getTime())
     const newCycle: Cycle ={
       id,
       task: data.task,
       minutesAmount: data.minutesAmount,
       startDate: new Date()
     }
     setCycles((state) => [...state, newCycle])
     setActiveCycleId(id)
     setAmountSecondsPassed(0)
     reset()
   }

  function handleInterruptCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id == activeCycleId) {
          return {...cycle, interruptedDate: new Date()}
        } else {
          return cycle
        }
      })
    )
    setActiveCycleId(null)
  }

  const task = watch('task')
  const isSubmitDisable = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewcycle)} action="">
        <CyclesContext.Provider value={{ activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondsPassed, setSecondsPassed}} >
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <Countdown />
        </CyclesContext.Provider>
        {
          activeCycle ? (
            <StopCountDownButton onClick={handleInterruptCycle} type="button"><HandPalm size={24} />Interromper</StopCountDownButton>
            ) : (
            <StartCountDownButton disabled={isSubmitDisable} type="submit"><Play size={24} />Começar</StartCountDownButton>
            )
        }
      </form>
    </HomeContainer>   
  )
}