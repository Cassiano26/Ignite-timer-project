import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountDownButton, StopCountDownButton } from "./styles";
import { NewCycleForm } from "./Components/NewcycleForm";
import { Countdown } from "./Components/CountDown";
import { FormProvider, useForm } from "react-hook-form";
import * as zod from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { CyclesContext } from "../../contexts/CyclesContexts";


const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(1, 'o ciclo precisa ser no minimo 5 minutos').max(60, 'o ciclo precisa ser no máximo 60 minutos'),
})

type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema >

export function Home() {

  const { activeCycle ,createNewcycle, interruptCurrentCycle } = useContext(CyclesContext)
  
  const newCycleForm = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema), 
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const {handleSubmit, watch, reset} = newCycleForm

  function handleCreateNewCycle(data : newCycleFormData) {
    createNewcycle(data)
    reset()
  }

  const task = watch('task')
  const isSubmitDisable = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />
        {
          activeCycle ? (
            <StopCountDownButton onClick={interruptCurrentCycle} type="button"><HandPalm size={24} />Interromper</StopCountDownButton>
            ) : (
            <StartCountDownButton disabled={isSubmitDisable} type="submit"><Play size={24} />Começar</StartCountDownButton>
            )
        }
      </form>
    </HomeContainer>   
  )
}