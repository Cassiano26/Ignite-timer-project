import { FormContainer, TaskInput, MinutesAmountInput } from './styles'
import { useContext } from 'react';
import { useFormContext } from 'react-hook-form';
import { CyclesContext } from '../../../../contexts/CyclesContexts';



export function NewCycleForm() {
  
  const {activeCycle} = useContext(CyclesContext)
  const { register } = useFormContext()

  return (
    <FormContainer>
    <label htmlFor="task">Vou trabalhar em</label>
    <TaskInput disabled={!!activeCycle} list="task-suggestion" id="task" placeholder="Dê um nome para o seu projeto" {...register('task')} />
    <datalist id="task-suggestion">
      <option value="projeto 1" />
      <option value="projeto 2" />
      <option value="projeto 3" />
    </datalist>
    <label htmlFor="minutesAmount">durante</label>
    <MinutesAmountInput disabled={!!activeCycle} step={5} min={1} max={60} id="minutesAmount" type="number" placeholder="00" {...register('minutesAmount', {valueAsNumber: true})} />
    <span>Minutos.</span>
  </FormContainer>
  )
}