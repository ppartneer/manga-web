import React from 'react'

const Component: React.FC<{ name: string }> = ({ name }) => (
  <div className="p-4 bg-surface rounded-lg mb-4">{name} Placeholder</div>
)

export default Component
