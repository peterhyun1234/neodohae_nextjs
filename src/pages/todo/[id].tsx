import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import TopAppBarHome from '@/components/appBar/TopAppBarHome';
import Styled from 'styled-components';
import LoadingPopup from '@/components/popup/LoadingPopup';

interface Todo {
    id: string;
    title: string;
    content: string;
    createdAt: string;
}

async function fetchTodo(id: string): Promise<Todo> {
    const response = await fetch(`/api/todo/${id}`);

    if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || 'Something went wrong');
    }

    const data: Todo = await response.json();
    return data;
}

const TodoDetail = () => {
    const router = useRouter();
    const { id } = router.query;

    const { data: todo, isLoading, error } = useQuery(['todo', id], () => fetchTodo(id as string), {
        enabled: !!id,
        retry: false,
        onError: (error) => {
          if (error instanceof Error) {
            alert(error.message);
            router.push('/');
          }
        }
    });

    if (isLoading) {
        return <LoadingPopup loadingText='Todo를 불러오는 중입니다.' />;
    }

    if (error || !todo) {
        return <div>Error occurred</div>;
    }

    return (
        <>
            <TopAppBarHome />
            <WrapBox>
                <h1>TODO ID: {todo.id}</h1>
                <h1>Title: {todo.title}</h1>
                <h1>Content: {todo.content}</h1>
            </WrapBox>
        </>
    );
};

const WrapBox = Styled.div`
  width: 100%;
  display: inline-block;
  max-width: 1000px;
  padding-top: calc(60px + 70px);
  padding-bottom: 100px;
  min-height: 100vh;

  @media (max-width: 650px) {
    padding-top: 60px;
  }
`;

export default TodoDetail;
