import { EmployerJobLists } from '@/features/employers/components/employer-job-list';
import React from 'react'

const JobsPage = () => {
    return (
        <div className='container w-1/3 md:w-3/4 lg:w-full mx-auto'>
            <h1 className='text-xl font-bold mb-6'>My Job Posts</h1>
            <EmployerJobLists />
        </div>
    )
}

export default JobsPage;
