// app/certificate/[eventId]/page.tsx
'use client'
import { Certificate } from '@/components/assets/certificate'
import Loading from '@/components/assets/loading'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function CertificatePage() {
  const { id } = useParams() as { id: string }
  const [certificateData, setCertificateData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/certificates?id=${id}`)
        setCertificateData(response.data)
      } catch (error) {
        console.error('Failed to load certificate data:', error)
      }
    }
    fetchData()
  }, [id])

  if (!certificateData) return <Loading/>

  return (
    <Certificate 
      data={certificateData}
      certificateId={id || ''}
    />
  )
}