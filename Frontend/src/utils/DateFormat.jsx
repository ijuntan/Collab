import React from 'react'

const DateFormat = ({date, color="text-slate-200"}) => {
  const now = new Date()

  const postDate = new Date(date)

  const diff = Math.floor((now - postDate)/ (1000 * 3600 * 24))
  
  let text = ""

  if(diff < 1) text="Today"
  else if(diff > 30) text= Math.floor(diff/30) + " Months Ago"
  else text= diff + " Days Ago"

  return(
      <div className={`${color} text-xs mt-1`}>
          {text}
      </div>
  )
}

export default DateFormat