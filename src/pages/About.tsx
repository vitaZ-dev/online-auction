import useCounterStore from "../stores/useCounterStore";

export default function About() {
  const { count, increase, decrease } = useCounterStore();
  return (
    <>
      <h1>about</h1>
      <div>
        <h1>{count}</h1>
        <button onClick={increase}>Increase</button>
        <button onClick={decrease}>Decrease</button>
      </div>
    </>
  );
}
