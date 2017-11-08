export class Report {
    errors: Message[] = []
    warnings: Message[] = []
    result: string
}

export class Message {
    message: string
    line?: number
    col?: number
    source?: string
    level: 'error' | 'warning' | 'info'
    middleware?: string
}

export class Result<T = string> {
    public result: T
    public report: Report = new Report()
}
