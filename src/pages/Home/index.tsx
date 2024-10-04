import { Play } from "phosphor-react";
import { CountDownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCountDownButton, TaskInput } from "./styles";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from 'zod'
import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5, 'o ciclo precisa ser no minimo 5 minutos').max(60, 'o ciclo precisa ser no máximo 60 minutos'),
})

type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema >

interface cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
}

export function Home() {

  const [ cycles, setCycles ] = useState<cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const {register, handleSubmit, watch, reset} = useForm<newCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema), 
    defaultValues: {
      task: '',
      minutesAmount: 0,
    }
  })

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)


  useEffect(() => {
    let interval : number
    if (activeCycle) {

      interval = setInterval(() => {
        setAmountSecondsPassed(differenceInSeconds(new Date(), activeCycle.startDate ))
      }, 1000)
    }
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle])

  function handleCreateNewcycle(data: newCycleFormData ) {
    const id = String(new Date().getTime())
    const newCycle: cycle ={
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

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60
  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')
  const task = watch('task')
  const isSubmitDisable = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewcycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput list="task-suggestion" id="task" placeholder="Dê um nome para o seu projeto" {...register('task')} />
          <datalist id="task-suggestion">
            <option value="projeto 1" />
            <option value="projeto 2" />
            <option value="projeto 3" />
          </datalist>
          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput step={5} min={5} max={60} id="minutesAmount" type="number" placeholder="00" {...register('minutesAmount', {valueAsNumber: true})} />
          <span>Minutos.</span>
        </FormContainer>
        <CountDownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountDownContainer>
        <StartCountDownButton disabled={isSubmitDisable} type="submit"><Play size={24} />Começar</StartCountDownButton>
      </form>
    </HomeContainer>   
  )
}