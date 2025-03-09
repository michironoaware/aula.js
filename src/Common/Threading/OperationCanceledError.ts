export class OperationCanceledError extends Error
{
	public constructor()
	{
		super("The operation was canceled.");
	}
}
