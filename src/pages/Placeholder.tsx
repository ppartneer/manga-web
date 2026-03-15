import React from 'react'

const Page: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <h1 className="text-3xl font-bold mb-4">{title}</h1>
    <p className="text-white/60">Эта страница находится в разработке...</p>
  </div>
)

export default Page
