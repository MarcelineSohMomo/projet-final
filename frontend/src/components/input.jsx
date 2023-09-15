export function Input(props){
	let {id,label,type,placeholder,value,onchange,error,success,required,ref} = props;
	return <div>
      <div className="tw-flex tw-space-between">
			<label htmlFor={id} className=" tw-font-semibold tw-block tw-mb-2"> 
				{label} 
				{required ? <span className="tw-text-red-700"> * </span> : null}
			</label>
			{error ? <label className="tw-text-red-700"> {error} </label>   : null }
		</div>
      <input  ref={ref} id={id} type={type} placeholder={placeholder} value={value} onChange={onchange} required={required}
			className={" tw-border tw-border-gray-700 tw-rounded-lg tw-px-4 tw-py-2 tw-transition tw-ease-in-out tw-m-0 tw-w-full " +
			(success ? "tw-border-green-400 tw-bg-green-200": "") + 
			(error ? "tw-border-red-400 tw-bg-red-200" : "")}
			/>
    </div>
}